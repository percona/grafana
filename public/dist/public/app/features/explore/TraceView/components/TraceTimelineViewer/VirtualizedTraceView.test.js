// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { render, screen } from '@testing-library/react';
import React from 'react';
import traceGenerator from '../demo/trace-generators';
import transformTraceData from '../model/transform-trace-data';
import { formatDuration } from '../utils/date';
import SpanTreeOffset from './SpanTreeOffset';
import VirtualizedTraceView from './VirtualizedTraceView';
jest.mock('./SpanTreeOffset');
const trace = transformTraceData(traceGenerator.trace({ numberOfSpans: 2 }));
const topOfExploreViewRef = jest.fn();
let props = {
    childrenHiddenIDs: new Set(),
    childrenToggle: jest.fn(),
    currentViewRangeTime: [0.25, 0.75],
    detailLogItemToggle: jest.fn(),
    detailLogsToggle: jest.fn(),
    detailProcessToggle: jest.fn(),
    detailStates: new Map(),
    detailTagsToggle: jest.fn(),
    detailToggle: jest.fn(),
    findMatchesIDs: null,
    setSpanNameColumnWidth: jest.fn(),
    spanNameColumnWidth: 0.5,
    trace,
    uiFind: 'uiFind',
    topOfExploreViewRef,
};
describe('<VirtualizedTraceViewImpl>', () => {
    beforeEach(() => {
        jest.mocked(SpanTreeOffset).mockReturnValue(React.createElement("div", null));
        Object.keys(props).forEach((key) => {
            if (typeof props[key] === 'function') {
                props[key].mockReset();
            }
        });
    });
    it('renders service name, operation name and duration for each span', () => {
        render(React.createElement(VirtualizedTraceView, Object.assign({}, props)));
        expect(screen.getAllByText(trace.services[0].name)).toBeTruthy();
        if (trace.services.length > 1) {
            expect(screen.getAllByText(trace.services[1].name)).toBeTruthy();
        }
        expect(screen.getAllByText(trace.spans[0].operationName)).toBeTruthy();
        expect(screen.getAllByText(trace.spans[1].operationName)).toBeTruthy();
        let durationSpan = formatDuration(trace.spans[0].duration);
        expect(screen.getAllByText(durationSpan)).toBeTruthy();
    });
    it('renders without exploding', () => {
        render(React.createElement(VirtualizedTraceView, Object.assign({}, props)));
        expect(screen.getByTestId('ListView')).toBeInTheDocument();
        expect(screen.getByTitle('Scroll to top')).toBeInTheDocument();
    });
    it('renders when a trace is not set', () => {
        props = Object.assign(Object.assign({}, props), { trace: null });
        render(React.createElement(VirtualizedTraceView, Object.assign({}, props)));
        expect(screen.getByTestId('ListView')).toBeInTheDocument();
        expect(screen.getByTitle('Scroll to top')).toBeInTheDocument();
    });
    it('renders ListView', () => {
        render(React.createElement(VirtualizedTraceView, Object.assign({}, props)));
        expect(screen.getByTestId('ListView')).toBeInTheDocument();
    });
    it('renders scrollToTopButton', () => {
        render(React.createElement(VirtualizedTraceView, Object.assign({}, props)));
        expect(screen.getByRole('button', {
            name: /Scroll to top/i,
        })).toBeInTheDocument();
    });
});
//# sourceMappingURL=VirtualizedTraceView.test.js.map