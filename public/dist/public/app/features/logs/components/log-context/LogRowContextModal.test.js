import { __awaiter } from "tslib";
import { screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { render } from 'test/redux-rtl';
import { createDataFrame, FieldType, LogRowContextQueryDirection, LogsSortOrder, } from '@grafana/data';
import { dataFrameToLogsModel } from '../../logsModel';
import { LogRowContextModal } from './LogRowContextModal';
const dfBefore = createDataFrame({
    fields: [
        {
            name: 'time',
            type: FieldType.time,
            values: ['2019-04-26T07:28:11.352440161Z', '2019-04-26T09:28:11.352440161Z'],
        },
        {
            name: 'message',
            type: FieldType.string,
            values: ['foo123', 'foo123'],
        },
    ],
});
const dfNow = createDataFrame({
    fields: [
        {
            name: 'time',
            type: FieldType.time,
            values: ['2019-04-26T09:28:11.352440161Z'],
        },
        {
            name: 'message',
            type: FieldType.string,
            values: ['foo123'],
        },
    ],
});
const dfAfter = createDataFrame({
    fields: [
        {
            name: 'time',
            type: FieldType.time,
            values: ['2019-04-26T14:42:50.991981292Z', '2019-04-26T16:28:11.352440161Z'],
        },
        {
            name: 'message',
            type: FieldType.string,
            values: ['foo123', 'bar123'],
        },
    ],
});
let uniqueRefIdCounter = 1;
const getRowContext = jest.fn().mockImplementation((_, options) => __awaiter(void 0, void 0, void 0, function* () {
    uniqueRefIdCounter += 1;
    const refId = `refid_${uniqueRefIdCounter}`;
    if (options.direction === LogRowContextQueryDirection.Forward) {
        return {
            data: [
                Object.assign({ refId }, dfBefore),
            ],
        };
    }
    else {
        return {
            data: [
                Object.assign({ refId }, dfAfter),
            ],
        };
    }
}));
const dispatchMock = jest.fn();
jest.mock('app/types', () => (Object.assign(Object.assign({}, jest.requireActual('app/types')), { useDispatch: () => dispatchMock })));
const splitOpenSym = Symbol('splitOpen');
const splitOpen = jest.fn().mockReturnValue(splitOpenSym);
jest.mock('app/features/explore/state/main', () => (Object.assign(Object.assign({}, jest.requireActual('app/features/explore/state/main')), { splitOpen: (arg) => {
        return splitOpen(arg);
    } })));
const logs = dataFrameToLogsModel([dfNow]);
const row = logs.rows[0];
const timeZone = 'UTC';
describe('LogRowContextModal', () => {
    const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
    beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = jest.fn();
    });
    afterEach(() => {
        window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
        jest.clearAllMocks();
    });
    it('should not render modal when it is closed', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: false, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(screen.queryByText('Log context')).not.toBeInTheDocument());
    }));
    it('should render modal when it is open', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(screen.queryByText('Log context')).toBeInTheDocument());
    }));
    it('should call getRowContext on open and change of row', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: false, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(getRowContext).not.toHaveBeenCalled());
    }));
    it('should call getRowContext on open', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(getRowContext).toHaveBeenCalledTimes(2));
    }));
    it('should render 3 lines containing `foo123`', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        // there need to be 2 lines with that message. 1 in before, 1 in now, 1 in after
        yield waitFor(() => expect(screen.getAllByText('foo123').length).toBe(3));
    }));
    it('should render 3 lines containing `foo123` with the same ms timestamp', () => __awaiter(void 0, void 0, void 0, function* () {
        const dfBeforeNs = createDataFrame({
            fields: [
                {
                    name: 'time',
                    type: FieldType.time,
                    values: [1, 1],
                },
                {
                    name: 'message',
                    type: FieldType.string,
                    values: ['foo123', 'foo123'],
                },
                {
                    name: 'tsNs',
                    type: FieldType.string,
                    values: ['1', '2'],
                },
            ],
        });
        const dfNowNs = createDataFrame({
            fields: [
                {
                    name: 'time',
                    type: FieldType.time,
                    values: [1],
                },
                {
                    name: 'message',
                    type: FieldType.string,
                    values: ['foo123'],
                },
                {
                    name: 'tsNs',
                    type: FieldType.string,
                    values: ['2'],
                },
            ],
        });
        const dfAfterNs = createDataFrame({
            fields: [
                {
                    name: 'time',
                    type: FieldType.time,
                    values: [1, 1],
                },
                {
                    name: 'message',
                    type: FieldType.string,
                    values: ['foo123', 'foo123'],
                },
                {
                    name: 'tsNs',
                    type: FieldType.string,
                    values: ['2', '3'],
                },
            ],
        });
        let uniqueRefIdCounter = 1;
        const logs = dataFrameToLogsModel([dfNowNs]);
        const row = logs.rows[0];
        const getRowContext = jest.fn().mockImplementation((_, options) => __awaiter(void 0, void 0, void 0, function* () {
            uniqueRefIdCounter += 1;
            const refId = `refid_${uniqueRefIdCounter}`;
            if (uniqueRefIdCounter === 2) {
                return {
                    data: [
                        Object.assign({ refId }, dfBeforeNs),
                    ],
                };
            }
            else if (uniqueRefIdCounter === 3) {
                return {
                    data: [
                        Object.assign({ refId }, dfAfterNs),
                    ],
                };
            }
            return { data: [] };
        }));
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        // there need to be 3 lines with that message. 1 in before, 1 in now, 1 in after
        yield waitFor(() => {
            expect(screen.getAllByText('foo123').length).toBe(3);
        });
    }));
    it('should show a split view button', () => __awaiter(void 0, void 0, void 0, function* () {
        const getRowContextQuery = jest.fn().mockResolvedValue({ datasource: { uid: 'test-uid' } });
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, getRowContextQuery: getRowContextQuery, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(screen.getByRole('button', {
            name: /open in split view/i,
        })).toBeInTheDocument());
    }));
    it('should not show a split view button', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => {
            expect(screen.queryByRole('button', {
                name: /open in split view/i,
            })).not.toBeInTheDocument();
        });
    }));
    it('should call getRowContextQuery', () => __awaiter(void 0, void 0, void 0, function* () {
        const getRowContextQuery = jest.fn().mockResolvedValue({ datasource: { uid: 'test-uid' } });
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, getRowContextQuery: getRowContextQuery, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => expect(getRowContextQuery).toHaveBeenCalledTimes(2));
    }));
    it('should close modal', () => __awaiter(void 0, void 0, void 0, function* () {
        const getRowContextQuery = jest.fn().mockResolvedValue({ datasource: { uid: 'test-uid' } });
        const onClose = jest.fn();
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: onClose, getRowContext: getRowContext, getRowContextQuery: getRowContextQuery, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        const splitViewButton = yield screen.findByRole('button', {
            name: /open in split view/i,
        });
        yield userEvent.click(splitViewButton);
        yield waitFor(() => expect(onClose).toHaveBeenCalled());
    }));
    it('should create correct splitOpen', () => __awaiter(void 0, void 0, void 0, function* () {
        const queryObj = { datasource: { uid: 'test-uid' } };
        const getRowContextQuery = jest.fn().mockResolvedValue(queryObj);
        const onClose = jest.fn();
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: onClose, getRowContext: getRowContext, getRowContextQuery: getRowContextQuery, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        const splitViewButton = yield screen.findByRole('button', {
            name: /open in split view/i,
        });
        yield userEvent.click(splitViewButton);
        yield waitFor(() => expect(splitOpen).toHaveBeenCalledWith(expect.objectContaining({
            queries: [queryObj],
            panelsState: {
                logs: {
                    id: row.uid,
                },
            },
        })));
    }));
    it('should dispatch splitOpen', () => __awaiter(void 0, void 0, void 0, function* () {
        const getRowContextQuery = jest.fn().mockResolvedValue({ datasource: { uid: 'test-uid' } });
        const onClose = jest.fn();
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: onClose, getRowContext: getRowContext, getRowContextQuery: getRowContextQuery, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        const splitViewButton = yield screen.findByRole('button', {
            name: /open in split view/i,
        });
        yield userEvent.click(splitViewButton);
        yield waitFor(() => expect(dispatchMock).toHaveBeenCalledWith(splitOpenSym));
    }));
    it('should make the center row sticky on load', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => {
            const rows = screen.getByTestId('entry-row');
            expect(rows).toHaveStyle('position: sticky');
        });
    }));
    it('should make the center row unsticky on unPinClick', () => __awaiter(void 0, void 0, void 0, function* () {
        render(React.createElement(LogRowContextModal, { row: row, open: true, onClose: () => { }, getRowContext: getRowContext, timeZone: timeZone, logsSortOrder: LogsSortOrder.Descending }));
        yield waitFor(() => {
            const rows = screen.getByTestId('entry-row');
            expect(rows).toHaveStyle('position: sticky');
        });
        const unpinButtons = screen.getAllByLabelText('Unpin line')[0];
        fireEvent.click(unpinButtons);
        yield waitFor(() => {
            const rows = screen.getByTestId('entry-row');
            expect(rows).not.toHaveStyle('position: sticky');
        });
    }));
});
//# sourceMappingURL=LogRowContextModal.test.js.map