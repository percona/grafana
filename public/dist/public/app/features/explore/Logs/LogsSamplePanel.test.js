import { __awaiter } from "tslib";
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FieldType, LoadingState, SupplementaryQueryType, createDataFrame } from '@grafana/data';
import { LogsSamplePanel } from './LogsSamplePanel';
jest.mock('@grafana/runtime', () => {
    return Object.assign(Object.assign({}, jest.requireActual('@grafana/runtime')), { reportInteraction: jest.fn() });
});
const createProps = (propOverrides) => {
    const props = {
        queryResponse: undefined,
        enabled: true,
        timeZone: 'timeZone',
        datasourceInstance: undefined,
        setLogsSampleEnabled: jest.fn(),
        queries: [],
        splitOpen: jest.fn(),
    };
    return Object.assign(Object.assign({}, props), propOverrides);
};
const emptyDataFrame = createDataFrame({ fields: [] });
const sampleDataFrame = createDataFrame({
    meta: {
        custom: { frameType: 'LabeledTimeValues' },
    },
    fields: [
        {
            name: 'labels',
            type: FieldType.other,
            values: [
                { place: 'luna', source: 'data' },
                { place: 'luna', source: 'data' },
            ],
        },
        {
            name: 'Time',
            type: FieldType.time,
            values: ['2022-02-22T09:28:11.352440161Z', '2022-02-22T14:42:50.991981292Z'],
        },
        {
            name: 'Line',
            type: FieldType.string,
            values: ['line1 ', 'line2'],
        },
    ],
});
const sampleDataFrame2 = createDataFrame({
    meta: {
        custom: { frameType: 'LabeledTimeValues' },
    },
    fields: [
        {
            name: 'labels',
            type: FieldType.other,
            values: [
                { place: 'luna', source: 'data' },
                { place: 'luna', source: 'data' },
            ],
        },
        {
            name: 'Time',
            type: FieldType.time,
            values: ['2023-02-22T09:28:11.352440161Z', '2023-02-22T14:42:50.991981292Z'],
        },
        {
            name: 'Line',
            type: FieldType.string,
            values: ['line3', 'line4'],
        },
    ],
});
describe('LogsSamplePanel', () => {
    it('shows empty panel if no data', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps())));
        expect(screen.getByText('Logs sample')).toBeInTheDocument();
    });
    it('shows loading message', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [], state: LoadingState.Loading } }))));
        expect(screen.getByText('Logs sample is loading...')).toBeInTheDocument();
    });
    it('shows no data message with no dataframe', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [], state: LoadingState.Done } }))));
        expect(screen.getByText('No logs sample data.')).toBeInTheDocument();
    });
    it('shows no data message with an empty dataframe', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [emptyDataFrame], state: LoadingState.Done } }))));
        expect(screen.getByText('No logs sample data.')).toBeInTheDocument();
    });
    it('shows logs sample data', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [sampleDataFrame], state: LoadingState.Done } }))));
        expect(screen.getByText('2022-02-22 04:28:11.352')).toBeInTheDocument();
        expect(screen.getByText('line1')).toBeInTheDocument();
        expect(screen.getByText('2022-02-22 09:42:50.991')).toBeInTheDocument();
        expect(screen.getByText('line2')).toBeInTheDocument();
    });
    it('shows logs sample data with multiple frames', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [sampleDataFrame, sampleDataFrame2], state: LoadingState.Done } }))));
        expect(screen.getByText('2022-02-22 04:28:11.352')).toBeInTheDocument();
        expect(screen.getByText('line1')).toBeInTheDocument();
        expect(screen.getByText('2022-02-22 09:42:50.991')).toBeInTheDocument();
        expect(screen.getByText('line2')).toBeInTheDocument();
        expect(screen.getByText('2023-02-22 04:28:11.352')).toBeInTheDocument();
        expect(screen.getByText('line3')).toBeInTheDocument();
        expect(screen.getByText('2023-02-22 09:42:50.991')).toBeInTheDocument();
        expect(screen.getByText('line4')).toBeInTheDocument();
    });
    it('shows logs sample data with multiple frames and first frame empty', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [emptyDataFrame, sampleDataFrame2], state: LoadingState.Done } }))));
        expect(screen.getByText('2023-02-22 04:28:11.352')).toBeInTheDocument();
        expect(screen.getByText('line3')).toBeInTheDocument();
        expect(screen.getByText('2023-02-22 09:42:50.991')).toBeInTheDocument();
        expect(screen.getByText('line4')).toBeInTheDocument();
    });
    it('shows log details', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({ queryResponse: { data: [sampleDataFrame], state: LoadingState.Done } }))));
        const line = screen.getByText('line1');
        expect(screen.queryByText('foo')).not.toBeInTheDocument();
        yield userEvent.click(line);
        expect(yield screen.findByText('Fields')).toBeInTheDocument();
        expect(yield screen.findByText('place')).toBeInTheDocument();
        expect(yield screen.findByText('luna')).toBeInTheDocument();
    }));
    it('shows warning message', () => {
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({
            queryResponse: { data: [], state: LoadingState.Error, error: { data: { message: 'Test error message' } } },
        }))));
        expect(screen.getByText('Failed to load logs sample for this query')).toBeInTheDocument();
        expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
    it('has split open button functionality', () => __awaiter(void 0, void 0, void 0, function* () {
        const datasourceInstance = {
            uid: 'test_uid',
            getDataProvider: jest.fn(),
            getSupportedSupplementaryQueryTypes: jest.fn().mockImplementation(() => [SupplementaryQueryType.LogsSample]),
            getSupplementaryQuery: jest.fn().mockImplementation(() => {
                return {
                    refId: 'test_refid',
                };
            }),
        };
        const splitOpen = jest.fn();
        render(React.createElement(LogsSamplePanel, Object.assign({}, createProps({
            queries: [{ refId: 'test_refid' }],
            queryResponse: { data: [sampleDataFrame], state: LoadingState.Done },
            splitOpen,
            datasourceInstance,
        }))));
        const splitButton = screen.getByText('Open logs in split view');
        expect(splitButton).toBeInTheDocument();
        yield userEvent.click(splitButton);
        expect(splitOpen).toHaveBeenCalledWith({ datasourceUid: 'test_uid', queries: [{ refId: 'test_refid' }] });
    }));
});
//# sourceMappingURL=LogsSamplePanel.test.js.map