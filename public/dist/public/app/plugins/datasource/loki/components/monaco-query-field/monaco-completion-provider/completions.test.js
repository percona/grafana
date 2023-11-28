import { __awaiter } from "tslib";
import LokiLanguageProvider from '../../../LanguageProvider';
import { createLokiDatasource } from '../../../mocks';
import { CompletionDataProvider } from './CompletionDataProvider';
import { getAfterSelectorCompletions, getCompletions } from './completions';
import { getSituation } from './situation';
import { calculateRange } from './index';
jest.mock('../../../querybuilder/operations', () => ({
    explainOperator: () => 'Operator docs',
}));
const history = [
    {
        ts: 12345678,
        query: {
            refId: 'test-1',
            expr: '{test: unit}',
        },
    },
    {
        ts: 87654321,
        query: {
            refId: 'test-1',
            expr: '{test: unit}',
        },
    },
];
const labelNames = ['place', 'source'];
const labelValues = ['moon', 'luna', 'server\\1'];
// Source is duplicated to test handling duplicated labels
const extractedLabelKeys = ['extracted', 'place', 'source'];
const unwrapLabelKeys = ['unwrap', 'labels'];
const otherLabels = [
    {
        name: 'place',
        value: 'luna',
        op: '=',
    },
];
const afterSelectorCompletions = [
    {
        documentation: 'Operator docs',
        insertText: '|= "$0"',
        isSnippet: true,
        label: '|= ""',
        type: 'LINE_FILTER',
    },
    {
        documentation: 'Operator docs',
        insertText: '!= "$0"',
        isSnippet: true,
        label: '!= ""',
        type: 'LINE_FILTER',
    },
    {
        documentation: 'Operator docs',
        insertText: '|~ "$0"',
        isSnippet: true,
        label: '|~ ""',
        type: 'LINE_FILTER',
    },
    {
        documentation: 'Operator docs',
        insertText: '!~ "$0"',
        isSnippet: true,
        label: '!~ ""',
        type: 'LINE_FILTER',
    },
    {
        documentation: 'Operator docs',
        insertText: '',
        label: '// Placeholder for the detected parser',
        type: 'DETECTED_PARSER_PLACEHOLDER',
    },
    {
        documentation: 'Operator docs',
        insertText: '',
        label: '// Placeholder for logfmt or json',
        type: 'OPPOSITE_PARSER_PLACEHOLDER',
    },
    {
        documentation: 'Operator docs',
        insertText: '| pattern',
        label: 'pattern',
        type: 'PARSER',
    },
    {
        documentation: 'Operator docs',
        insertText: '| regexp',
        label: 'regexp',
        type: 'PARSER',
    },
    {
        documentation: 'Operator docs',
        insertText: '| unpack',
        label: 'unpack',
        type: 'PARSER',
    },
    {
        insertText: '| line_format "{{.$0}}"',
        isSnippet: true,
        label: 'line_format',
        type: 'PIPE_OPERATION',
        documentation: 'Operator docs',
    },
    {
        insertText: '| label_format',
        isSnippet: true,
        label: 'label_format',
        type: 'PIPE_OPERATION',
        documentation: 'Operator docs',
    },
    {
        insertText: '| unwrap',
        label: 'unwrap',
        type: 'PIPE_OPERATION',
        documentation: 'Operator docs',
    },
    {
        insertText: '| decolorize',
        label: 'decolorize',
        type: 'PIPE_OPERATION',
        documentation: 'Operator docs',
    },
    {
        documentation: 'Operator docs',
        insertText: '| drop',
        label: 'drop',
        type: 'PIPE_OPERATION',
    },
    {
        documentation: 'Operator docs',
        insertText: '| keep',
        label: 'keep',
        type: 'PIPE_OPERATION',
    },
];
function buildAfterSelectorCompletions(detectedParser, otherParser, afterPipe, hasSpace) {
    const explanation = '(detected)';
    let expectedCompletions = afterSelectorCompletions.map((completion) => {
        if (completion.type === 'DETECTED_PARSER_PLACEHOLDER') {
            return Object.assign(Object.assign({}, completion), { type: 'PARSER', label: `${detectedParser} ${explanation}`, insertText: `| ${detectedParser}` });
        }
        else if (completion.type === 'OPPOSITE_PARSER_PLACEHOLDER') {
            return Object.assign(Object.assign({}, completion), { type: 'PARSER', label: otherParser, insertText: `| ${otherParser}` });
        }
        return Object.assign({}, completion);
    });
    if (afterPipe) {
        // Remove pipe
        expectedCompletions = expectedCompletions
            .map((completion) => {
            completion.insertText = completion.insertText.replace('|', '').trimStart();
            return completion;
        })
            // Remove != and !~
            .filter((completion) => !completion.insertText.startsWith('!'))
            .filter((completion) => (hasSpace ? completion.type !== 'LINE_FILTER' : true));
    }
    expectedCompletions.forEach((completion) => {
        if (completion.type !== 'LINE_FILTER') {
            completion.insertText = hasSpace ? completion.insertText.trimStart() : ` ${completion.insertText}`;
        }
    });
    return expectedCompletions;
}
describe('getCompletions', () => {
    let completionProvider, languageProvider, datasource;
    beforeEach(() => {
        datasource = createLokiDatasource();
        languageProvider = new LokiLanguageProvider(datasource);
        completionProvider = new CompletionDataProvider(languageProvider, {
            current: history,
        });
        jest.spyOn(completionProvider, 'getLabelNames').mockResolvedValue(labelNames);
        jest.spyOn(completionProvider, 'getLabelValues').mockResolvedValue(labelValues);
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys,
            unwrapLabelKeys,
            hasJSON: false,
            hasLogfmt: false,
            hasPack: false,
        });
    });
    test.each(['EMPTY', 'AT_ROOT'])(`Returns completion options when the situation is %s`, (type) => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toHaveLength(25);
    }));
    test('Returns completion options when the situation is IN_RANGE', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'IN_RANGE' };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toEqual([
            { insertText: '$__auto', label: '$__auto', type: 'DURATION' },
            { insertText: '1m', label: '1m', type: 'DURATION' },
            { insertText: '5m', label: '5m', type: 'DURATION' },
            { insertText: '10m', label: '10m', type: 'DURATION' },
            { insertText: '30m', label: '30m', type: 'DURATION' },
            { insertText: '1h', label: '1h', type: 'DURATION' },
            { insertText: '1d', label: '1d', type: 'DURATION' },
        ]);
    }));
    test('Returns completion options when the situation is IN_GROUPING', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'IN_GROUPING', logQuery: '' };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toEqual([
            {
                insertText: 'extracted',
                label: 'extracted',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'place',
                label: 'place',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'source',
                label: 'source',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
        ]);
    }));
    test('Returns completion options when the situation is IN_LABEL_SELECTOR_NO_LABEL_NAME', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'IN_LABEL_SELECTOR_NO_LABEL_NAME', otherLabels };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toEqual([
            {
                insertText: 'place=',
                label: 'place',
                triggerOnInsert: true,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'source=',
                label: 'source',
                triggerOnInsert: true,
                type: 'LABEL_NAME',
            },
        ]);
    }));
    test('Returns completion options when the situation is IN_LABEL_SELECTOR_WITH_LABEL_NAME', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LABEL_SELECTOR_WITH_LABEL_NAME',
            otherLabels,
            labelName: '',
            betweenQuotes: false,
        };
        let completions = yield getCompletions(situation, completionProvider);
        expect(completions).toEqual([
            {
                insertText: '"moon"',
                label: 'moon',
                type: 'LABEL_VALUE',
            },
            {
                insertText: '"luna"',
                label: 'luna',
                type: 'LABEL_VALUE',
            },
            {
                insertText: '"server\\\\1"',
                label: 'server\\1',
                type: 'LABEL_VALUE',
            },
        ]);
        completions = yield getCompletions(Object.assign(Object.assign({}, situation), { betweenQuotes: true }), completionProvider);
        expect(completions).toEqual([
            {
                insertText: 'moon',
                label: 'moon',
                type: 'LABEL_VALUE',
            },
            {
                insertText: 'luna',
                label: 'luna',
                type: 'LABEL_VALUE',
            },
            {
                insertText: 'server\\\\1',
                label: 'server\\1',
                type: 'LABEL_VALUE',
            },
        ]);
    }));
    test.each([
        [true, true],
        [false, true],
        [true, false],
        [false, false],
    ])('Returns completion options when the situation is AFTER_SELECTOR, detected JSON parser, afterPipe %s, and hasSpace: %s', (afterPipe, hasSpace) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys,
            unwrapLabelKeys,
            hasJSON: true,
            hasLogfmt: false,
            hasPack: false,
        });
        const situation = { type: 'AFTER_SELECTOR', logQuery: '{job="grafana"}', afterPipe, hasSpace };
        const completions = yield getCompletions(situation, completionProvider);
        const expected = buildAfterSelectorCompletions('json', 'logfmt', afterPipe, hasSpace);
        expect(completions).toEqual(expected);
    }));
    test.each([true, false])('Returns completion options when the situation is AFTER_SELECTOR, detected Logfmt parser, afterPipe %s, and hasSpace: %s', (afterPipe) => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys,
            unwrapLabelKeys,
            hasJSON: false,
            hasLogfmt: true,
            hasPack: false,
        });
        const situation = { type: 'AFTER_SELECTOR', logQuery: '', afterPipe, hasSpace: true };
        const completions = yield getCompletions(situation, completionProvider);
        const expected = buildAfterSelectorCompletions('logfmt', 'json', afterPipe, true);
        expect(completions).toEqual(expected);
    }));
    test('Returns completion options when the situation is IN_AGGREGATION', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'IN_AGGREGATION' };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toHaveLength(22);
    }));
    test('Returns completion options when the situation is AFTER_UNWRAP', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'AFTER_UNWRAP', logQuery: '' };
        const completions = yield getCompletions(situation, completionProvider);
        const extractedCompletions = completions.filter((completion) => completion.type === 'LABEL_NAME');
        const functionCompletions = completions.filter((completion) => completion.type === 'FUNCTION');
        expect(extractedCompletions).toEqual([
            {
                insertText: 'unwrap',
                label: 'unwrap',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'labels',
                label: 'labels',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
        ]);
        expect(functionCompletions).toHaveLength(3);
    }));
    test('Returns completion options when the situation is AFTER_KEEP_AND_DROP', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = { type: 'AFTER_KEEP_AND_DROP', logQuery: '{label="value"}' };
        const completions = yield getCompletions(situation, completionProvider);
        expect(completions).toEqual([
            {
                insertText: 'extracted',
                label: 'extracted',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'place',
                label: 'place',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
            {
                insertText: 'source',
                label: 'source',
                triggerOnInsert: false,
                type: 'LABEL_NAME',
            },
        ]);
    }));
});
describe('getAfterSelectorCompletions', () => {
    let datasource;
    let languageProvider;
    let completionProvider;
    beforeEach(() => {
        datasource = createLokiDatasource();
        languageProvider = new LokiLanguageProvider(datasource);
        completionProvider = new CompletionDataProvider(languageProvider, {
            current: history,
        });
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys: ['abc', 'def'],
            unwrapLabelKeys: [],
            hasJSON: true,
            hasLogfmt: false,
            hasPack: false,
        });
    });
    it('should remove trailing pipeline from logQuery', () => {
        getAfterSelectorCompletions(`{job="grafana"} | `, true, true, completionProvider);
        expect(completionProvider.getParserAndLabelKeys).toHaveBeenCalledWith(`{job="grafana"}`);
    });
    it('should show detected parser if query has no parser', () => __awaiter(void 0, void 0, void 0, function* () {
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} |  `, true, true, completionProvider);
        const parsersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'PARSER')
            .map((parser) => parser.label);
        expect(parsersInSuggestions).toStrictEqual(['json (detected)', 'logfmt', 'pattern', 'regexp', 'unpack']);
    }));
    it('should show detected unpack parser if query has no parser', () => __awaiter(void 0, void 0, void 0, function* () {
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys: ['abc', 'def'],
            unwrapLabelKeys: [],
            hasJSON: true,
            hasLogfmt: false,
            hasPack: true,
        });
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} |  `, true, true, completionProvider);
        const parsersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'PARSER')
            .map((parser) => parser.label);
        expect(parsersInSuggestions).toStrictEqual(['unpack (detected)', 'json', 'logfmt', 'pattern', 'regexp']);
    }));
    it('should not show the detected parser if query already has parser', () => __awaiter(void 0, void 0, void 0, function* () {
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} | logfmt | `, true, true, completionProvider);
        const parsersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'PARSER')
            .map((parser) => parser.label);
        expect(parsersInSuggestions).toStrictEqual(['json', 'logfmt', 'pattern', 'regexp', 'unpack']);
    }));
    it('should show label filter options if query has parser and trailing pipeline', () => __awaiter(void 0, void 0, void 0, function* () {
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} | logfmt | `, true, true, completionProvider);
        const labelFiltersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'LABEL_NAME')
            .map((label) => label.label);
        expect(labelFiltersInSuggestions).toStrictEqual(['abc (detected)', 'def (detected)']);
    }));
    it('should show label filter options if query has parser and no trailing pipeline', () => __awaiter(void 0, void 0, void 0, function* () {
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} | logfmt`, true, true, completionProvider);
        const labelFiltersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'LABEL_NAME')
            .map((label) => label.label);
        expect(labelFiltersInSuggestions).toStrictEqual(['abc (detected)', 'def (detected)']);
    }));
    it('should not show label filter options if query has no parser', () => __awaiter(void 0, void 0, void 0, function* () {
        const suggestions = yield getAfterSelectorCompletions(`{job="grafana"} | `, true, true, completionProvider);
        const labelFiltersInSuggestions = suggestions
            .filter((suggestion) => suggestion.type === 'LABEL_NAME')
            .map((label) => label.label);
        expect(labelFiltersInSuggestions.length).toBe(0);
    }));
});
describe('IN_LOGFMT completions', () => {
    let datasource;
    let languageProvider;
    let completionProvider;
    beforeEach(() => {
        datasource = createLokiDatasource();
        languageProvider = new LokiLanguageProvider(datasource);
        completionProvider = new CompletionDataProvider(languageProvider, {
            current: history,
        });
        jest.spyOn(completionProvider, 'getParserAndLabelKeys').mockResolvedValue({
            extractedLabelKeys: ['label1', 'label2'],
            unwrapLabelKeys: [],
            hasJSON: true,
            hasLogfmt: false,
            hasPack: false,
        });
    });
    it('autocompleting logfmt should return flags, pipe operations, and labels', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt `,
            flags: false,
            trailingSpace: true,
            trailingComma: false,
            otherLabels: [],
        };
        expect(yield getCompletions(situation, completionProvider)).toMatchInlineSnapshot(`
      [
        {
          "documentation": "Strict parsing. The logfmt parser stops scanning the log line and returns early with an error when it encounters any poorly formatted key/value pair.",
          "insertText": "--strict",
          "label": "--strict",
          "type": "FUNCTION",
        },
        {
          "documentation": "Retain standalone keys with empty value. The logfmt parser retains standalone keys (keys without a value) as labels with value set to empty string.",
          "insertText": "--keep-empty",
          "label": "--keep-empty",
          "type": "FUNCTION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| line_format "{{.$0}}"",
          "isSnippet": true,
          "label": "line_format",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| label_format",
          "isSnippet": true,
          "label": "label_format",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| unwrap",
          "label": "unwrap",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| decolorize",
          "label": "decolorize",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| drop",
          "label": "drop",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| keep",
          "label": "keep",
          "type": "PIPE_OPERATION",
        },
        {
          "insertText": "label1",
          "label": "label1",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
        {
          "insertText": "label2",
          "label": "label2",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
      ]
    `);
    }));
    it('autocompleting logfmt with flags and trailing space should return pipe operations, and labels', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt`,
            flags: true,
            trailingSpace: true,
            trailingComma: false,
            otherLabels: [],
        };
        expect(yield getCompletions(situation, completionProvider)).toMatchInlineSnapshot(`
      [
        {
          "documentation": "Operator docs",
          "insertText": "| line_format "{{.$0}}"",
          "isSnippet": true,
          "label": "line_format",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| label_format",
          "isSnippet": true,
          "label": "label_format",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| unwrap",
          "label": "unwrap",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| decolorize",
          "label": "decolorize",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| drop",
          "label": "drop",
          "type": "PIPE_OPERATION",
        },
        {
          "documentation": "Operator docs",
          "insertText": "| keep",
          "label": "keep",
          "type": "PIPE_OPERATION",
        },
        {
          "insertText": "label1",
          "label": "label1",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
        {
          "insertText": "label2",
          "label": "label2",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
      ]
    `);
    }));
    it('autocompleting logfmt with labels and trailing comma should only return labels', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt,`,
            flags: false,
            trailingComma: true,
            trailingSpace: false,
            otherLabels: [],
        };
        expect(yield getCompletions(situation, completionProvider)).toMatchInlineSnapshot(`
      [
        {
          "insertText": "label1",
          "label": "label1",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
        {
          "insertText": "label2",
          "label": "label2",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
      ]
    `);
    }));
    it('autocompleting logfmt should exclude already used labels from the suggestions', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt label1, label2`,
            flags: true,
            trailingSpace: true,
            trailingComma: false,
            otherLabels: ['label1', 'label2'],
        };
        const completions = yield getCompletions(situation, completionProvider);
        const labelCompletions = completions.filter((completion) => completion.type === 'LABEL_NAME');
        expect(labelCompletions).toHaveLength(0);
    }));
    it.each([
        // {label="value"} | logfmt ^
        [true, false, [], false],
        // {label="value"} | logfmt otherLabel ^
        [true, false, ['otherLabel'], true],
        // {label="value"} | logfmt otherLabel^
        [false, false, ['otherLabel'], false],
        // {label="value"} | logfmt lab^
        [false, false, ['lab'], false],
        // {label="value"} | logfmt otherLabel,^
        [false, true, ['otherLabel'], false],
        // {label="value"} | logfmt lab, ^
        [true, true, ['otherLabel'], false],
        // {label="value"} | logfmt otherLabel ^
        [true, false, ['otherLabel'], true],
    ])('when space is %p, comma %p, and other labels %o => inserting a comma should be %p', (trailingSpace, trailingComma, otherLabels, shouldHaveComma) => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `does not matter`,
            flags: true,
            trailingComma,
            trailingSpace,
            otherLabels,
        };
        const completions = yield getCompletions(situation, completionProvider);
        const labelCompletions = completions.filter((completion) => completion.type === 'LABEL_NAME');
        expect(labelCompletions).toHaveLength(2);
        expect(labelCompletions[0].insertText.startsWith(',')).toBe(shouldHaveComma);
        expect(labelCompletions[1].insertText.startsWith(',')).toBe(shouldHaveComma);
    }));
    it('autocompleting logfmt without flags should only offer labels when the user has a trailing comma', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt --strict label3,`,
            flags: false,
            trailingComma: true,
            trailingSpace: false,
            otherLabels: ['label1'],
        };
        expect(yield getCompletions(situation, completionProvider)).toMatchInlineSnapshot(`
      [
        {
          "insertText": "label2",
          "label": "label2",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
      ]
    `);
    }));
    it('autocompleting logfmt with flags should only offer labels when the user has a trailing comma', () => __awaiter(void 0, void 0, void 0, function* () {
        const situation = {
            type: 'IN_LOGFMT',
            logQuery: `{job="grafana"} | logfmt --strict label3,`,
            flags: true,
            trailingComma: true,
            trailingSpace: false,
            otherLabels: ['label1'],
        };
        expect(yield getCompletions(situation, completionProvider)).toMatchInlineSnapshot(`
      [
        {
          "insertText": "label2",
          "label": "label2",
          "triggerOnInsert": false,
          "type": "LABEL_NAME",
        },
      ]
    `);
    }));
    describe('calculateRange', () => {
        let monaco;
        beforeEach(() => {
            monaco = {
                Range: {
                    lift(range) {
                        return range;
                    },
                },
            };
        });
        it('getSituation fails to return autocomplete when inserting before any other labels', () => {
            // Ideally we'd be able to autocomplete in this situation as well, but currently not supported to insert labels at the start.
            //{^label1="value1",label2="value2"}
            const situation = getSituation('{label1="value1",label2="value2"}', 1);
            expect(situation).toBe(null);
        });
        it('tests inserting new label before existing label name', () => {
            const situation = getSituation('{label1="value1",label2="value2"}', 17);
            expect(situation === null || situation === void 0 ? void 0 : situation.type).toBe('IN_LABEL_SELECTOR_NO_LABEL_NAME');
            const word = {
                word: 'label2="value2"',
                startColumn: 17,
                endColumn: 32,
            };
            const wordUntil = {
                word: '',
                startColumn: 17,
                endColumn: 17,
            };
            const position = {
                lineNumber: 1,
                column: 17,
            };
            expect(calculateRange(situation, word, wordUntil, monaco, position)).toMatchObject({
                startLineNumber: 1,
                endLineNumber: 1,
                startColumn: 17,
                endColumn: 32,
            });
        });
        it('tests inserting new label within existing label value', () => {
            //{label1="value1",label2="^value2"}
            const situation = getSituation('{label1="value1",label2="value"}', 25);
            expect(situation === null || situation === void 0 ? void 0 : situation.type).toBe('IN_LABEL_SELECTOR_WITH_LABEL_NAME');
            const word = {
                word: 'label2="value2"',
                startColumn: 18,
                endColumn: 33,
            };
            const wordUntil = {
                word: 'label2="',
                startColumn: 18,
                endColumn: 26,
            };
            const position = {
                lineNumber: 1,
                column: 25,
            };
            expect(calculateRange(situation, word, wordUntil, monaco, position)).toMatchObject({
                startLineNumber: 1,
                endLineNumber: 1,
                startColumn: 26,
                endColumn: 32,
            });
        });
        it('tests inserting new label within existing label value containing dashes', () => {
            // {label1="value1",label2="value2^-value"}
            const situation = getSituation('{label1="value1",label2="value2-value"}', 30);
            expect(situation === null || situation === void 0 ? void 0 : situation.type).toBe('IN_LABEL_SELECTOR_WITH_LABEL_NAME');
            const word = {
                word: 'label2="value2-value"',
                startColumn: 18,
                endColumn: 39,
            };
            const wordUntil = {
                word: 'label2="value2',
                startColumn: 18,
                endColumn: 32,
            };
            const position = {
                lineNumber: 1,
                column: 25,
            };
            expect(calculateRange(situation, word, wordUntil, monaco, position)).toMatchObject({
                startLineNumber: 1,
                endLineNumber: 1,
                startColumn: 26,
                endColumn: 38,
            });
        });
    });
});
//# sourceMappingURL=completions.test.js.map