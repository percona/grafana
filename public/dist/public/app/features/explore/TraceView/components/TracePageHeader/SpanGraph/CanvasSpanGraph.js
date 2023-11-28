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
import { css } from '@emotion/css';
import * as React from 'react';
import { withTheme2, stylesFactory } from '@grafana/ui';
import { autoColor } from '../../Theme';
import { getRgbColorByKey } from '../../utils/color-generator';
import renderIntoCanvas from './render-into-canvas';
const getStyles = stylesFactory((theme) => {
    return {
        CanvasSpanGraph: css `
      label: CanvasSpanGraph;
      background: ${autoColor(theme, '#fafafa')};
      height: 60px;
      position: absolute;
      width: 100%;
    `,
    };
});
export class UnthemedCanvasSpanGraph extends React.PureComponent {
    constructor(props) {
        super(props);
        this.getColor = (key) => getRgbColorByKey(key, this.props.theme);
        this._setCanvasRef = (elm) => {
            this._canvasElm = elm;
        };
        this._canvasElm = undefined;
    }
    componentDidMount() {
        this._draw();
    }
    componentDidUpdate() {
        this._draw();
    }
    _draw() {
        if (this._canvasElm) {
            const { valueWidth: totalValueWidth, items } = this.props;
            renderIntoCanvas(this._canvasElm, items, totalValueWidth, this.getColor, autoColor(this.props.theme, '#fff'));
        }
    }
    render() {
        return (React.createElement("canvas", { className: getStyles(this.props.theme).CanvasSpanGraph, ref: this._setCanvasRef, "data-testid": "CanvasSpanGraph" }));
    }
}
export default withTheme2(UnthemedCanvasSpanGraph);
//# sourceMappingURL=CanvasSpanGraph.js.map