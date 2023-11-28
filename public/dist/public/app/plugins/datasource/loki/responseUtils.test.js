import { cloneDeep } from 'lodash';
import { FieldType } from '@grafana/data';
import { getMockFrames } from './mocks';
import { dataFrameHasLevelLabel, dataFrameHasLokiError, extractLevelLikeLabelFromDataFrame, extractLogParserFromDataFrame, extractLabelKeysFromDataFrame, extractUnwrapLabelKeysFromDataFrame, cloneQueryResponse, combineResponses, } from './responseUtils';
const frame = {
    length: 1,
    fields: [
        {
            name: 'Time',
            config: {},
            type: FieldType.time,
            values: [1],
        },
        {
            name: 'labels',
            config: {},
            type: FieldType.other,
            values: [{ level: 'info' }],
        },
        {
            name: 'Line',
            config: {},
            type: FieldType.string,
            values: ['line1'],
        },
    ],
};
describe('dataFrameHasParsingError', () => {
    it('handles frame with parsing error', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ level: 'info', __error__: 'error' }];
        expect(dataFrameHasLokiError(input)).toBe(true);
    });
    it('handles frame without parsing error', () => {
        const input = cloneDeep(frame);
        expect(dataFrameHasLokiError(input)).toBe(false);
    });
});
describe('dataFrameHasLevelLabel', () => {
    it('returns true if level label is present', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ level: 'info' }];
        expect(dataFrameHasLevelLabel(input)).toBe(true);
    });
    it('returns false if level label is present', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ foo: 'bar' }];
        expect(dataFrameHasLevelLabel(input)).toBe(false);
    });
});
describe('extractLevelLikeLabelFromDataFrame', () => {
    it('returns label if lvl label is present', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ lvl: 'info' }];
        expect(extractLevelLikeLabelFromDataFrame(input)).toBe('lvl');
    });
    it('returns label if level-like label is present', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ error_level: 'info' }];
        expect(extractLevelLikeLabelFromDataFrame(input)).toBe('error_level');
    });
    it('returns undefined if no level-like label is present', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ foo: 'info' }];
        expect(extractLevelLikeLabelFromDataFrame(input)).toBe(null);
    });
});
describe('extractLogParserFromDataFrame', () => {
    it('returns false by default', () => {
        const input = cloneDeep(frame);
        expect(extractLogParserFromDataFrame(input)).toEqual({ hasJSON: false, hasLogfmt: false, hasPack: false });
    });
    it('identifies JSON', () => {
        const input = cloneDeep(frame);
        input.fields[2].values = ['{"a":"b"}'];
        expect(extractLogParserFromDataFrame(input)).toEqual({ hasJSON: true, hasLogfmt: false, hasPack: false });
    });
    it('identifies logfmt', () => {
        const input = cloneDeep(frame);
        input.fields[2].values = ['a=b'];
        expect(extractLogParserFromDataFrame(input)).toEqual({ hasJSON: false, hasLogfmt: true, hasPack: false });
    });
});
describe('extractLabelKeysFromDataFrame', () => {
    it('returns empty by default', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [];
        expect(extractLabelKeysFromDataFrame(input)).toEqual([]);
    });
    it('extracts label keys', () => {
        const input = cloneDeep(frame);
        expect(extractLabelKeysFromDataFrame(input)).toEqual(['level']);
    });
});
describe('extractUnwrapLabelKeysFromDataFrame', () => {
    it('returns empty by default', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [];
        expect(extractUnwrapLabelKeysFromDataFrame(input)).toEqual([]);
    });
    it('extracts possible unwrap label keys', () => {
        const input = cloneDeep(frame);
        input.fields[1].values = [{ number: 13 }];
        expect(extractUnwrapLabelKeysFromDataFrame(input)).toEqual(['number']);
    });
});
describe('cloneQueryResponse', () => {
    const { logFrameA } = getMockFrames();
    const responseA = {
        data: [logFrameA],
    };
    it('clones query responses', () => {
        const clonedA = cloneQueryResponse(responseA);
        expect(clonedA).not.toBe(responseA);
        expect(clonedA).toEqual(clonedA);
    });
});
describe('combineResponses', () => {
    it('combines logs frames', () => {
        const { logFrameA, logFrameB } = getMockFrames();
        const responseA = {
            data: [logFrameA],
        };
        const responseB = {
            data: [logFrameB],
        };
        expect(combineResponses(responseA, responseB)).toEqual({
            data: [
                {
                    fields: [
                        {
                            config: {},
                            name: 'Time',
                            type: 'time',
                            values: [1, 2, 3, 4],
                        },
                        {
                            config: {},
                            name: 'Line',
                            type: 'string',
                            values: ['line3', 'line4', 'line1', 'line2'],
                        },
                        {
                            config: {},
                            name: 'labels',
                            type: 'other',
                            values: [
                                {
                                    otherLabel: 'other value',
                                },
                                {
                                    label: 'value',
                                },
                                {
                                    otherLabel: 'other value',
                                },
                            ],
                        },
                        {
                            config: {},
                            name: 'tsNs',
                            type: 'string',
                            values: ['1000000', '2000000', '3000000', '4000000'],
                        },
                        {
                            config: {},
                            name: 'id',
                            type: 'string',
                            values: ['id3', 'id4', 'id1', 'id2'],
                        },
                    ],
                    length: 4,
                    meta: {
                        custom: {
                            frameType: 'LabeledTimeValues',
                        },
                        stats: [
                            {
                                displayName: 'Summary: total bytes processed',
                                unit: 'decbytes',
                                value: 33,
                            },
                        ],
                    },
                    refId: 'A',
                },
            ],
        });
    });
    it('combines metric frames', () => {
        const { metricFrameA, metricFrameB } = getMockFrames();
        const responseA = {
            data: [metricFrameA],
        };
        const responseB = {
            data: [metricFrameB],
        };
        expect(combineResponses(responseA, responseB)).toEqual({
            data: [
                {
                    fields: [
                        {
                            config: {},
                            name: 'Time',
                            type: 'time',
                            values: [1000000, 2000000, 3000000, 4000000],
                        },
                        {
                            config: {},
                            name: 'Value',
                            type: 'number',
                            values: [6, 7, 5, 4],
                            labels: {
                                level: 'debug',
                            },
                        },
                    ],
                    length: 4,
                    meta: {
                        type: 'timeseries-multi',
                        stats: [
                            {
                                displayName: 'Summary: total bytes processed',
                                unit: 'decbytes',
                                value: 33,
                            },
                        ],
                    },
                    refId: 'A',
                },
            ],
        });
    });
    it('combines and identifies new frames in the response', () => {
        const { metricFrameA, metricFrameB, metricFrameC } = getMockFrames();
        const responseA = {
            data: [metricFrameA],
        };
        const responseB = {
            data: [metricFrameB, metricFrameC],
        };
        expect(combineResponses(responseA, responseB)).toEqual({
            data: [
                {
                    fields: [
                        {
                            config: {},
                            name: 'Time',
                            type: 'time',
                            values: [1000000, 2000000, 3000000, 4000000],
                        },
                        {
                            config: {},
                            name: 'Value',
                            type: 'number',
                            values: [6, 7, 5, 4],
                            labels: {
                                level: 'debug',
                            },
                        },
                    ],
                    length: 4,
                    meta: {
                        type: 'timeseries-multi',
                        stats: [
                            {
                                displayName: 'Summary: total bytes processed',
                                unit: 'decbytes',
                                value: 33,
                            },
                        ],
                    },
                    refId: 'A',
                },
                metricFrameC,
            ],
        });
    });
    it('combines frames prioritizing refIds over names', () => {
        const { metricFrameA, metricFrameB } = getMockFrames();
        const dataFrameA = Object.assign(Object.assign({}, metricFrameA), { refId: 'A', name: 'A' });
        const dataFrameB = Object.assign(Object.assign({}, metricFrameB), { refId: 'B', name: 'A' });
        const responseA = {
            data: [dataFrameA],
        };
        const responseB = {
            data: [dataFrameB],
        };
        expect(combineResponses(responseA, responseB)).toEqual({
            data: [dataFrameA, dataFrameB],
        });
    });
    it('combines frames in a new response instance', () => {
        const { metricFrameA, metricFrameB } = getMockFrames();
        const responseA = {
            data: [metricFrameA],
        };
        const responseB = {
            data: [metricFrameB],
        };
        expect(combineResponses(null, responseA)).not.toBe(responseA);
        expect(combineResponses(null, responseB)).not.toBe(responseB);
    });
    it('combine when first param has errors', () => {
        var _a, _b, _c;
        const { metricFrameA, metricFrameB } = getMockFrames();
        const errorA = {
            message: 'errorA',
        };
        const responseA = {
            data: [metricFrameA],
            error: errorA,
            errors: [errorA],
        };
        const responseB = {
            data: [metricFrameB],
        };
        const combined = combineResponses(responseA, responseB);
        expect(combined.data[0].length).toBe(4);
        expect((_a = combined.error) === null || _a === void 0 ? void 0 : _a.message).toBe('errorA');
        expect(combined.errors).toHaveLength(1);
        expect((_c = (_b = combined.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toBe('errorA');
    });
    it('combine when second param has errors', () => {
        var _a, _b, _c;
        const { metricFrameA, metricFrameB } = getMockFrames();
        const responseA = {
            data: [metricFrameA],
        };
        const errorB = {
            message: 'errorB',
        };
        const responseB = {
            data: [metricFrameB],
            error: errorB,
            errors: [errorB],
        };
        const combined = combineResponses(responseA, responseB);
        expect(combined.data[0].length).toBe(4);
        expect((_a = combined.error) === null || _a === void 0 ? void 0 : _a.message).toBe('errorB');
        expect(combined.errors).toHaveLength(1);
        expect((_c = (_b = combined.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toBe('errorB');
    });
    it('combine when both params have errors', () => {
        var _a, _b, _c, _d, _e;
        const { metricFrameA, metricFrameB } = getMockFrames();
        const errorA = {
            message: 'errorA',
        };
        const errorB = {
            message: 'errorB',
        };
        const responseA = {
            data: [metricFrameA],
            error: errorA,
            errors: [errorA],
        };
        const responseB = {
            data: [metricFrameB],
            error: errorB,
            errors: [errorB],
        };
        const combined = combineResponses(responseA, responseB);
        expect(combined.data[0].length).toBe(4);
        expect((_a = combined.error) === null || _a === void 0 ? void 0 : _a.message).toBe('errorA');
        expect(combined.errors).toHaveLength(2);
        expect((_c = (_b = combined.errors) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message).toBe('errorA');
        expect((_e = (_d = combined.errors) === null || _d === void 0 ? void 0 : _d[1]) === null || _e === void 0 ? void 0 : _e.message).toBe('errorB');
    });
    it('combines frames with nanoseconds', () => {
        const { logFrameA, logFrameB } = getMockFrames();
        logFrameA.fields[0].nanos = [333333, 444444];
        logFrameB.fields[0].nanos = [111111, 222222];
        const responseA = {
            data: [logFrameA],
        };
        const responseB = {
            data: [logFrameB],
        };
        expect(combineResponses(responseA, responseB)).toEqual({
            data: [
                {
                    fields: [
                        {
                            config: {},
                            name: 'Time',
                            type: 'time',
                            values: [1, 2, 3, 4],
                            nanos: [111111, 222222, 333333, 444444],
                        },
                        {
                            config: {},
                            name: 'Line',
                            type: 'string',
                            values: ['line3', 'line4', 'line1', 'line2'],
                        },
                        {
                            config: {},
                            name: 'labels',
                            type: 'other',
                            values: [
                                {
                                    otherLabel: 'other value',
                                },
                                {
                                    label: 'value',
                                },
                                {
                                    otherLabel: 'other value',
                                },
                            ],
                        },
                        {
                            config: {},
                            name: 'tsNs',
                            type: 'string',
                            values: ['1000000', '2000000', '3000000', '4000000'],
                        },
                        {
                            config: {},
                            name: 'id',
                            type: 'string',
                            values: ['id3', 'id4', 'id1', 'id2'],
                        },
                    ],
                    length: 4,
                    meta: {
                        custom: {
                            frameType: 'LabeledTimeValues',
                        },
                        stats: [
                            {
                                displayName: 'Summary: total bytes processed',
                                unit: 'decbytes',
                                value: 33,
                            },
                        ],
                    },
                    refId: 'A',
                },
            ],
        });
    });
    describe('combine stats', () => {
        const { metricFrameA } = getMockFrames();
        const makeResponse = (stats) => ({
            data: [
                Object.assign(Object.assign({}, metricFrameA), { meta: Object.assign(Object.assign({}, metricFrameA.meta), { stats }) }),
            ],
        });
        it('two values', () => {
            const responseA = makeResponse([
                { displayName: 'Ingester: total reached', value: 1 },
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 11 },
            ]);
            const responseB = makeResponse([
                { displayName: 'Ingester: total reached', value: 2 },
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 22 },
            ]);
            expect(combineResponses(responseA, responseB).data[0].meta.stats).toStrictEqual([
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 33 },
            ]);
        });
        it('one value', () => {
            const responseA = makeResponse([
                { displayName: 'Ingester: total reached', value: 1 },
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 11 },
            ]);
            const responseB = makeResponse();
            expect(combineResponses(responseA, responseB).data[0].meta.stats).toStrictEqual([
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 11 },
            ]);
            expect(combineResponses(responseB, responseA).data[0].meta.stats).toStrictEqual([
                { displayName: 'Summary: total bytes processed', unit: 'decbytes', value: 11 },
            ]);
        });
        it('no value', () => {
            const responseA = makeResponse();
            const responseB = makeResponse();
            expect(combineResponses(responseA, responseB).data[0].meta.stats).toHaveLength(0);
        });
    });
});
//# sourceMappingURL=responseUtils.test.js.map