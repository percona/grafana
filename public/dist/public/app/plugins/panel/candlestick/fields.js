import { FieldType, getFieldDisplayName, outerJoinDataFrames, } from '@grafana/data';
import { maybeSortFrame } from '@grafana/data/src/transformations/transformers/joinDataFrames';
import { findField } from 'app/features/dimensions';
import { prepareGraphableFields } from '../timeseries/utils';
import { VizDisplayMode } from './types';
export const candlestickFieldsInfo = {
    open: {
        key: 'open',
        name: 'Open',
        defaults: ['open', 'o'],
        description: 'Value at the start of the period',
    },
    high: {
        key: 'high',
        name: 'High',
        defaults: ['high', 'h', 'max'],
        description: 'Maximum value within the period',
    },
    low: {
        key: 'low',
        name: 'Low',
        defaults: ['low', 'l', 'min'],
        description: 'Minimum value within the period',
    },
    close: {
        key: 'close',
        name: 'Close',
        defaults: ['close', 'c'],
        description: 'Value at the end of the period',
    },
    volume: {
        key: 'volume',
        name: 'Volume',
        defaults: ['volume', 'v'],
        description: 'Sample count within the period',
    },
};
function findFieldOrAuto(frame, info, options) {
    const field = findField(frame, options[info.key]);
    if (!field) {
        for (const field of frame.fields) {
            const name = getFieldDisplayName(field, frame).toLowerCase();
            if (info.defaults.includes(name) || info.defaults.includes(field.name)) {
                return field;
            }
        }
    }
    return field;
}
export function prepareCandlestickFields(series, options, theme, timeRange) {
    var _a;
    if (!(series === null || series === void 0 ? void 0 : series.length)) {
        return null;
    }
    // All fields
    const fieldMap = (_a = options.fields) !== null && _a !== void 0 ? _a : {};
    const aligned = series.length === 1
        ? maybeSortFrame(series[0], series[0].fields.findIndex((f) => f.type === FieldType.time))
        : outerJoinDataFrames({ frames: series });
    if (!(aligned === null || aligned === void 0 ? void 0 : aligned.length)) {
        return null;
    }
    const data = { aligned, frame: aligned, names: {} };
    // Apply same filter as everything else in timeseries
    const timeSeriesFrames = prepareGraphableFields([aligned], theme, timeRange);
    if (!timeSeriesFrames) {
        return null;
    }
    const frame = (data.frame = timeSeriesFrames[0]);
    const timeIndex = frame.fields.findIndex((f) => f.type === FieldType.time);
    if (timeIndex < 0) {
        return null;
    }
    // Find the known fields
    const used = new Set();
    for (const info of Object.values(candlestickFieldsInfo)) {
        const field = findFieldOrAuto(frame, info, fieldMap);
        if (field) {
            data[info.key] = field;
            used.add(field);
        }
    }
    // Use first numeric value as open
    if (!data.open && !data.close) {
        data.open = frame.fields.find((f) => f.type === FieldType.number);
        if (data.open) {
            used.add(data.open);
        }
    }
    // Use next open as 'close' value
    if (data.open && !data.close && !fieldMap.close) {
        const values = data.open.values.slice(1);
        values.push(values[values.length - 1]); // duplicate last value
        data.close = Object.assign(Object.assign({}, data.open), { values: values, name: 'Next open', state: undefined });
        used.add(data.close);
        frame.fields.push(data.close);
        data.autoOpenClose = true;
    }
    // Use previous close as 'open' value
    if (data.close && !data.open && !fieldMap.open) {
        const values = data.close.values.slice();
        values.unshift(values[0]); // duplicate first value
        values.length = frame.length;
        data.open = Object.assign(Object.assign({}, data.close), { values: values, name: 'Previous close', state: undefined });
        used.add(data.open);
        frame.fields.push(data.open);
        data.autoOpenClose = true;
    }
    // Use the open field for min/max if nothing is set
    if (!data.high && !fieldMap.high) {
        data.high = data.open;
    }
    if (!data.low && !fieldMap.low) {
        data.low = data.open;
    }
    // unmap low and high fields in volume-only mode, and volume field in candles-only mode
    // so they fall through to unmapped fields and get appropriate includeAllFields treatment
    if (options.mode === VizDisplayMode.Volume) {
        if (data.high) {
            if (data.high !== data.open) {
                used.delete(data.high);
            }
            data.high = undefined;
        }
        if (data.low) {
            if (data.low !== data.open) {
                used.delete(data.low);
            }
            data.low = undefined;
        }
    }
    else if (options.mode === VizDisplayMode.Candles) {
        if (data.volume) {
            used.delete(data.volume);
            data.volume = undefined;
        }
    }
    // Register the name of each mapped field
    for (const info of Object.values(candlestickFieldsInfo)) {
        const f = data[info.key];
        if (f) {
            data.names[info.key] = getFieldDisplayName(f, data.frame);
        }
    }
    const timeField = frame.fields[timeIndex];
    // Make sure first field is time!
    const fields = [timeField];
    if (!options.includeAllFields) {
        fields.push(...used);
    }
    else {
        fields.push(...frame.fields.filter((f) => f !== timeField));
    }
    data.frame = Object.assign(Object.assign({}, data.frame), { fields });
    // Force update all the indicies
    for (let i = 0; i < data.frame.fields.length; i++) {
        const field = data.frame.fields[i];
        field.state = Object.assign(Object.assign({}, field.state), { 
            // time is unused (-1), y series enumerate from 0
            seriesIndex: i - 1, origin: {
                fieldIndex: i,
                frameIndex: 0,
            } });
    }
    return data;
}
//# sourceMappingURL=fields.js.map