import uPlot from 'uplot';
import { FieldColorModeId, fieldColorModeRegistry, formattedValueToString, getDisplayProcessor, getFieldColorModeForField, getFieldDisplayName, getFieldSeriesColor, } from '@grafana/data';
import { alpha } from '@grafana/data/src/themes/colorManipulator';
import { config } from '@grafana/runtime';
import { AxisPlacement, ScaleDirection, ScaleOrientation, VisibilityMode, ScaleDimensionMode, } from '@grafana/schema';
import { UPlotConfigBuilder } from '@grafana/ui';
import { findFieldIndex, getScaledDimensionForField } from 'app/features/dimensions';
import { pointWithin, Quadtree } from '../barchart/quadtree';
import { DEFAULT_POINT_SIZE } from './config';
import { isGraphable } from './dims';
import { defaultFieldConfig, ScatterShow } from './panelcfg.gen';
/**
 * This is called when options or structure rev changes
 */
export function prepScatter(options, getData, theme, ttip, onUPlotClick, isToolTipOpen) {
    let series;
    let builder;
    try {
        series = prepSeries(options, getData());
        builder = prepConfig(getData, series, theme, ttip, onUPlotClick, isToolTipOpen);
    }
    catch (e) {
        let errorMsg = 'Unknown error in prepScatter';
        if (typeof e === 'string') {
            errorMsg = e;
        }
        else if (e instanceof Error) {
            errorMsg = e.message;
        }
        return {
            error: errorMsg,
            series: [],
        };
    }
    return {
        series,
        builder,
    };
}
function getScatterSeries(seriesIndex, frames, frameIndex, xIndex, yIndex, dims) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const frame = frames[frameIndex];
    const y = frame.fields[yIndex];
    let state = (_a = y.state) !== null && _a !== void 0 ? _a : {};
    state.seriesIndex = seriesIndex;
    y.state = state;
    // Color configs
    //----------------
    let seriesColor = dims.pointColorFixed
        ? config.theme2.visualization.getColorByName(dims.pointColorFixed)
        : getFieldSeriesColor(y, config.theme2).color;
    let pointColor = () => seriesColor;
    const fieldConfig = Object.assign(Object.assign({}, defaultFieldConfig), y.config.custom);
    let pointColorMode = fieldColorModeRegistry.get(FieldColorModeId.PaletteClassic);
    if (dims.pointColorIndex) {
        const f = frames[frameIndex].fields[dims.pointColorIndex];
        if (f) {
            pointColorMode = getFieldColorModeForField(y);
            if (pointColorMode.isByValue) {
                const index = dims.pointColorIndex;
                pointColor = (frame) => {
                    var _a;
                    const field = frame.fields[index];
                    if ((_a = field.state) === null || _a === void 0 ? void 0 : _a.range) {
                        // this forces local min/max recalc, rather than using global min/max from field.state
                        field.state.range = undefined;
                    }
                    field.display = getDisplayProcessor({ field, theme: config.theme2 });
                    return field.values.map((v) => field.display(v).color); // slow!
                };
            }
            else {
                seriesColor = pointColorMode.getCalculator(f, config.theme2)(f.values[0], 1);
                pointColor = () => seriesColor;
            }
        }
    }
    // Size configs
    //----------------
    let pointSizeHints = dims.pointSizeConfig;
    let pointSizeFixed = (_f = (_c = (_b = dims.pointSizeConfig) === null || _b === void 0 ? void 0 : _b.fixed) !== null && _c !== void 0 ? _c : (_e = (_d = y.config.custom) === null || _d === void 0 ? void 0 : _d.pointSize) === null || _e === void 0 ? void 0 : _e.fixed) !== null && _f !== void 0 ? _f : DEFAULT_POINT_SIZE;
    let pointSize = () => pointSizeFixed;
    if (dims.pointSizeIndex) {
        pointSize = (frame) => {
            const s = getScaledDimensionForField(frame.fields[dims.pointSizeIndex], dims.pointSizeConfig, ScaleDimensionMode.Quad);
            const vals = Array(frame.length);
            for (let i = 0; i < frame.length; i++) {
                vals[i] = s.get(i);
            }
            return vals;
        };
    }
    else {
        pointSizeHints = {
            fixed: pointSizeFixed,
            min: pointSizeFixed,
            max: pointSizeFixed,
        };
    }
    // Series config
    //----------------
    const name = getFieldDisplayName(y, frame, frames);
    return {
        name,
        frame: (frames) => frames[frameIndex],
        x: (frame) => frame.fields[xIndex],
        y: (frame) => frame.fields[yIndex],
        legend: () => {
            return [
                {
                    label: name,
                    color: seriesColor,
                    getItemKey: () => name,
                    yAxis: yIndex, // << but not used
                },
            ];
        },
        showLine: fieldConfig.show !== ScatterShow.Points,
        lineWidth: (_g = fieldConfig.lineWidth) !== null && _g !== void 0 ? _g : 2,
        lineStyle: fieldConfig.lineStyle,
        lineColor: () => seriesColor,
        showPoints: fieldConfig.show !== ScatterShow.Lines ? VisibilityMode.Always : VisibilityMode.Never,
        pointSize,
        pointColor,
        pointSymbol: (frame, from) => 'circle',
        label: VisibilityMode.Never,
        labelValue: () => '',
        show: !((_h = frame.fields[yIndex].config.custom.hideFrom) === null || _h === void 0 ? void 0 : _h.viz),
        hints: {
            pointSize: pointSizeHints,
            pointColor: {
                mode: pointColorMode,
            },
        },
    };
}
function prepSeries(options, frames) {
    var _a, _b, _c, _d, _e, _f;
    let seriesIndex = 0;
    if (!frames.length) {
        throw 'Missing data';
    }
    if (options.seriesMapping === 'manual') {
        if (!((_a = options.series) === null || _a === void 0 ? void 0 : _a.length)) {
            throw 'Missing series config';
        }
        const scatterSeries = [];
        for (const series of options.series) {
            if (!(series === null || series === void 0 ? void 0 : series.x)) {
                throw 'Select X dimension';
            }
            if (!(series === null || series === void 0 ? void 0 : series.y)) {
                throw 'Select Y dimension';
            }
            for (let frameIndex = 0; frameIndex < frames.length; frameIndex++) {
                const frame = frames[frameIndex];
                const xIndex = findFieldIndex(frame, series.x);
                if (xIndex != null) {
                    // TODO: this should find multiple y fields
                    const yIndex = findFieldIndex(frame, series.y);
                    if (yIndex == null) {
                        throw 'Y must be in the same frame as X';
                    }
                    const dims = {
                        pointColorFixed: (_b = series.pointColor) === null || _b === void 0 ? void 0 : _b.fixed,
                        pointColorIndex: findFieldIndex(frame, (_c = series.pointColor) === null || _c === void 0 ? void 0 : _c.field),
                        pointSizeConfig: series.pointSize,
                        pointSizeIndex: findFieldIndex(frame, (_d = series.pointSize) === null || _d === void 0 ? void 0 : _d.field),
                    };
                    scatterSeries.push(getScatterSeries(seriesIndex++, frames, frameIndex, xIndex, yIndex, dims));
                }
            }
        }
        return scatterSeries;
    }
    // Default behavior
    const dims = (_e = options.dims) !== null && _e !== void 0 ? _e : {};
    const frameIndex = (_f = dims.frame) !== null && _f !== void 0 ? _f : 0;
    const frame = frames[frameIndex];
    const numericIndices = [];
    let xIndex = findFieldIndex(frame, dims.x);
    for (let i = 0; i < frame.fields.length; i++) {
        if (isGraphable(frame.fields[i])) {
            if (xIndex == null || i === xIndex) {
                xIndex = i;
                continue;
            }
            if (dims.exclude && dims.exclude.includes(getFieldDisplayName(frame.fields[i], frame, frames))) {
                continue; // skip
            }
            numericIndices.push(i);
        }
    }
    if (xIndex == null) {
        throw 'Missing X dimension';
    }
    if (!numericIndices.length) {
        throw 'No Y values';
    }
    return numericIndices.map((yIndex) => getScatterSeries(seriesIndex++, frames, frameIndex, xIndex, yIndex, {}));
}
//const prepConfig: UPlotConfigPrepFnXY<Options> = ({ frames, series, theme }) => {
const prepConfig = (getData, scatterSeries, theme, ttip, onUPlotClick, isToolTipOpen) => {
    let qt;
    let hRect;
    function drawBubblesFactory(opts) {
        const drawBubbles = (u, seriesIdx, idx0, idx1) => {
            uPlot.orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim, moveTo, lineTo, rect, arc) => {
                var _a, _b;
                const pxRatio = uPlot.pxRatio;
                const scatterInfo = scatterSeries[seriesIdx - 1];
                let d = u.data[seriesIdx];
                let showLine = scatterInfo.showLine;
                let showPoints = scatterInfo.showPoints === VisibilityMode.Always;
                if (!showPoints && scatterInfo.showPoints === VisibilityMode.Auto) {
                    showPoints = d[0].length < 1000;
                }
                // always show something
                if (!showPoints && !showLine) {
                    showLine = true;
                }
                let strokeWidth = 1;
                u.ctx.save();
                u.ctx.rect(u.bbox.left, u.bbox.top, u.bbox.width, u.bbox.height);
                u.ctx.clip();
                u.ctx.fillStyle = series.fill(); // assumes constant
                u.ctx.strokeStyle = series.stroke();
                u.ctx.lineWidth = strokeWidth;
                let deg360 = 2 * Math.PI;
                let xKey = scaleX.key;
                let yKey = scaleY.key;
                let pointHints = scatterInfo.hints.pointSize;
                const colorByValue = scatterInfo.hints.pointColor.mode.isByValue;
                let maxSize = ((_a = pointHints.max) !== null && _a !== void 0 ? _a : pointHints.fixed) * pxRatio;
                // todo: this depends on direction & orientation
                // todo: calc once per redraw, not per path
                let filtLft = u.posToVal(-maxSize / 2, xKey);
                let filtRgt = u.posToVal(u.bbox.width / pxRatio + maxSize / 2, xKey);
                let filtBtm = u.posToVal(u.bbox.height / pxRatio + maxSize / 2, yKey);
                let filtTop = u.posToVal(-maxSize / 2, yKey);
                let sizes = opts.disp.size.values(u, seriesIdx);
                let pointColors = opts.disp.color.values(u, seriesIdx);
                let pointAlpha = opts.disp.color.alpha;
                let linePath = showLine ? new Path2D() : null;
                let curColor = null;
                for (let i = 0; i < d[0].length; i++) {
                    let xVal = d[0][i];
                    let yVal = d[1][i];
                    let size = sizes[i] * pxRatio;
                    if (xVal >= filtLft && xVal <= filtRgt && yVal >= filtBtm && yVal <= filtTop) {
                        let cx = valToPosX(xVal, scaleX, xDim, xOff);
                        let cy = valToPosY(yVal, scaleY, yDim, yOff);
                        if (showLine) {
                            linePath.lineTo(cx, cy);
                        }
                        if (showPoints) {
                            u.ctx.moveTo(cx + size / 2, cy);
                            u.ctx.beginPath();
                            u.ctx.arc(cx, cy, size / 2, 0, deg360);
                            if (colorByValue) {
                                if (pointColors[i] !== curColor) {
                                    curColor = pointColors[i];
                                    u.ctx.fillStyle = alpha(curColor, pointAlpha);
                                    u.ctx.strokeStyle = curColor;
                                }
                            }
                            u.ctx.fill();
                            u.ctx.stroke();
                            opts.each(u, seriesIdx, i, cx - size / 2 - strokeWidth / 2, cy - size / 2 - strokeWidth / 2, size + strokeWidth, size + strokeWidth);
                        }
                    }
                }
                if (showLine) {
                    let frame = scatterInfo.frame(getData());
                    u.ctx.strokeStyle = scatterInfo.lineColor(frame);
                    u.ctx.lineWidth = scatterInfo.lineWidth * pxRatio;
                    const { lineStyle } = scatterInfo;
                    if (lineStyle && lineStyle.fill !== 'solid') {
                        if (lineStyle.fill === 'dot') {
                            u.ctx.lineCap = 'round';
                        }
                        u.ctx.setLineDash((_b = lineStyle.dash) !== null && _b !== void 0 ? _b : [10, 10]);
                    }
                    u.ctx.stroke(linePath);
                }
                u.ctx.restore();
            });
            return null;
        };
        return drawBubbles;
    }
    let drawBubbles = drawBubblesFactory({
        disp: {
            size: {
                //unit: 3, // raw CSS pixels
                values: (u, seriesIdx) => {
                    return u.data[seriesIdx][2]; // already contains final pixel geometry
                    //let [minValue, maxValue] = getSizeMinMax(u);
                    //return u.data[seriesIdx][2].map(v => getSize(v, minValue, maxValue));
                },
            },
            color: {
                // string values
                values: (u, seriesIdx) => {
                    return u.data[seriesIdx][3];
                },
                alpha: 0.5,
            },
        },
        each: (u, seriesIdx, dataIdx, lft, top, wid, hgt) => {
            // we get back raw canvas coords (included axes & padding). translate to the plotting area origin
            lft -= u.bbox.left;
            top -= u.bbox.top;
            qt.add({ x: lft, y: top, w: wid, h: hgt, sidx: seriesIdx, didx: dataIdx });
        },
    });
    const builder = new UPlotConfigBuilder();
    builder.setCursor({
        drag: { setScale: true },
        dataIdx: (u, seriesIdx) => {
            if (seriesIdx === 1) {
                const pxRatio = uPlot.pxRatio;
                hRect = null;
                let dist = Infinity;
                let cx = u.cursor.left * pxRatio;
                let cy = u.cursor.top * pxRatio;
                qt.get(cx, cy, 1, 1, (o) => {
                    if (pointWithin(cx, cy, o.x, o.y, o.x + o.w, o.y + o.h)) {
                        let ocx = o.x + o.w / 2;
                        let ocy = o.y + o.h / 2;
                        let dx = ocx - cx;
                        let dy = ocy - cy;
                        let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
                        // test against radius for actual hover
                        if (d <= o.w / 2) {
                            // only hover bbox with closest distance
                            if (d <= dist) {
                                dist = d;
                                hRect = o;
                            }
                        }
                    }
                });
            }
            return hRect && seriesIdx === hRect.sidx ? hRect.didx : null;
        },
        points: {
            size: (u, seriesIdx) => {
                return hRect && seriesIdx === hRect.sidx ? hRect.w / uPlot.pxRatio : 0;
            },
            fill: (u, seriesIdx) => 'rgba(255,255,255,0.4)',
        },
    });
    const clearPopupIfOpened = () => {
        if (isToolTipOpen.current) {
            ttip(undefined);
            if (onUPlotClick) {
                onUPlotClick();
            }
        }
    };
    let ref_parent = null;
    // clip hover points/bubbles to plotting area
    builder.addHook('init', (u, r) => {
        u.over.style.overflow = 'hidden';
        ref_parent = u.root.parentElement;
        if (onUPlotClick) {
            ref_parent === null || ref_parent === void 0 ? void 0 : ref_parent.addEventListener('click', onUPlotClick);
        }
    });
    builder.addHook('destroy', (u) => {
        if (onUPlotClick) {
            ref_parent === null || ref_parent === void 0 ? void 0 : ref_parent.removeEventListener('click', onUPlotClick);
            clearPopupIfOpened();
        }
    });
    let rect;
    // rect of .u-over (grid area)
    builder.addHook('syncRect', (u, r) => {
        rect = r;
    });
    builder.addHook('setLegend', (u) => {
        if (u.cursor.idxs != null) {
            for (let i = 0; i < u.cursor.idxs.length; i++) {
                const sel = u.cursor.idxs[i];
                if (sel != null && !isToolTipOpen.current) {
                    ttip({
                        scatterIndex: i - 1,
                        xIndex: sel,
                        pageX: rect.left + u.cursor.left,
                        pageY: rect.top + u.cursor.top,
                    });
                    return; // only show the first one
                }
            }
        }
        if (!isToolTipOpen.current) {
            ttip(undefined);
        }
    });
    builder.addHook('drawClear', (u) => {
        clearPopupIfOpened();
        qt = qt || new Quadtree(0, 0, u.bbox.width, u.bbox.height);
        qt.clear();
        // force-clear the path cache to cause drawBars() to rebuild new quadtree
        u.series.forEach((s, i) => {
            if (i > 0) {
                // @ts-ignore
                s._paths = null;
            }
        });
    });
    builder.setMode(2);
    const frames = getData();
    let xField = scatterSeries[0].x(scatterSeries[0].frame(frames));
    let config = xField.config;
    let customConfig = config.custom;
    let scaleDistr = customConfig === null || customConfig === void 0 ? void 0 : customConfig.scaleDistribution;
    builder.addScale({
        scaleKey: 'x',
        isTime: false,
        orientation: ScaleOrientation.Horizontal,
        direction: ScaleDirection.Right,
        distribution: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.type,
        log: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.log,
        linearThreshold: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.linearThreshold,
        min: config.min,
        max: config.max,
        softMin: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisSoftMin,
        softMax: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisSoftMax,
        centeredZero: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisCenteredZero,
        decimals: config.decimals,
    });
    // why does this fall back to '' instead of null or undef?
    let xAxisLabel = customConfig.axisLabel;
    builder.addAxis({
        scaleKey: 'x',
        placement: (customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisPlacement) !== AxisPlacement.Hidden ? AxisPlacement.Bottom : AxisPlacement.Hidden,
        show: (customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisPlacement) !== AxisPlacement.Hidden,
        grid: { show: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisGridShow },
        border: { show: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisBorderShow },
        theme,
        label: xAxisLabel == null || xAxisLabel === ''
            ? getFieldDisplayName(xField, scatterSeries[0].frame(frames), frames)
            : xAxisLabel,
        formatValue: (v, decimals) => formattedValueToString(xField.display(v, decimals)),
    });
    scatterSeries.forEach((s, si) => {
        var _a, _b;
        let frame = s.frame(frames);
        let field = s.y(frame);
        const lineColor = s.lineColor(frame);
        const pointColor = asSingleValue(frame, s.pointColor);
        //const lineColor = s.lineColor(frame);
        //const lineWidth = s.lineWidth;
        let scaleKey = (_a = field.config.unit) !== null && _a !== void 0 ? _a : 'y';
        let config = field.config;
        let customConfig = config.custom;
        let scaleDistr = customConfig === null || customConfig === void 0 ? void 0 : customConfig.scaleDistribution;
        builder.addScale({
            scaleKey,
            orientation: ScaleOrientation.Vertical,
            direction: ScaleDirection.Up,
            distribution: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.type,
            log: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.log,
            linearThreshold: scaleDistr === null || scaleDistr === void 0 ? void 0 : scaleDistr.linearThreshold,
            min: config.min,
            max: config.max,
            softMin: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisSoftMin,
            softMax: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisSoftMax,
            centeredZero: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisCenteredZero,
            decimals: config.decimals,
        });
        // why does this fall back to '' instead of null or undef?
        let yAxisLabel = customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisLabel;
        builder.addAxis({
            scaleKey,
            theme,
            placement: (customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisPlacement) === AxisPlacement.Auto ? AxisPlacement.Left : customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisPlacement,
            show: (customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisPlacement) !== AxisPlacement.Hidden,
            grid: { show: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisGridShow },
            border: { show: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisBorderShow },
            size: customConfig === null || customConfig === void 0 ? void 0 : customConfig.axisWidth,
            label: yAxisLabel == null || yAxisLabel === ''
                ? getFieldDisplayName(field, scatterSeries[si].frame(frames), frames)
                : yAxisLabel,
            formatValue: (v, decimals) => formattedValueToString(field.display(v, decimals)),
        });
        builder.addSeries({
            facets: [
                {
                    scale: 'x',
                    auto: true,
                },
                {
                    scale: scaleKey,
                    auto: true,
                },
            ],
            pathBuilder: drawBubbles,
            theme,
            scaleKey: '',
            lineColor: lineColor,
            fillColor: alpha(pointColor, 0.5),
            show: !((_b = customConfig.hideFrom) === null || _b === void 0 ? void 0 : _b.viz),
        });
    });
    /*
    builder.setPrepData((frames) => {
      let seriesData = lookup.fieldMaps.flatMap((f, i) => {
        let { fields } = frames[i];
  
        return f.y.map((yIndex, frameSeriesIndex) => {
          let xValues = fields[f.x[frameSeriesIndex]].values;
          let yValues = fields[f.y[frameSeriesIndex]].values;
          let sizeValues = f.size![frameSeriesIndex](frames[i]);
  
          if (!Array.isArray(sizeValues)) {
            sizeValues = Array(xValues.length).fill(sizeValues);
          }
  
          return [xValues, yValues, sizeValues];
        });
      });
  
      return [null, ...seriesData];
    });
    */
    return builder;
};
/**
 * This is called everytime the data changes
 *
 * from?  is this where we would support that?  -- need the previous values
 */
export function prepData(info, data, from) {
    if (info.error || !data.length) {
        return [null];
    }
    return [
        null,
        ...info.series.map((s, idx) => {
            const frame = s.frame(data);
            let colorValues;
            const r = s.pointColor(frame);
            if (Array.isArray(r)) {
                colorValues = r;
            }
            else {
                colorValues = Array(frame.length).fill(r);
            }
            return [
                s.x(frame).values,
                s.y(frame).values,
                asArray(frame, s.pointSize),
                colorValues,
            ];
        }),
    ];
}
function asArray(frame, lookup) {
    const r = lookup(frame);
    if (Array.isArray(r)) {
        return r;
    }
    return Array(frame.length).fill(r);
}
function asSingleValue(frame, lookup) {
    const r = lookup(frame);
    if (Array.isArray(r)) {
        return r[0];
    }
    return r;
}
//# sourceMappingURL=scatter.js.map