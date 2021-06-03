import { UNITS } from './constants';
import { PeriodType, Unit, LeadingZero, ClockFormat } from './types';

export const getCronStringFromValues = (
  period: PeriodType,
  months?: number[],
  monthDays?: number[],
  weekDays?: number[],
  hours?: number[],
  minutes?: number[],
  humanizeValue?: boolean
) => {
  const newMonths = period === 'year' && months ? months : [];
  const newMonthDays = (period === 'year' || period === 'month') && monthDays ? monthDays : [];
  const newWeekDays = (period === 'year' || period === 'month' || period === 'week') && weekDays ? weekDays : [];
  const newHours = period !== 'minute' && period !== 'hour' && hours ? hours : [];
  const newMinutes = period !== 'minute' && minutes ? minutes : [];
  console.log(newMonths, newMonthDays, newWeekDays, newHours, newMinutes);
  const parsedArray = parseCronArray([newMinutes, newHours, newMonthDays, newMonths, newWeekDays], humanizeValue);

  return parsedArray.join(' ');
};

const fixSunday = (values: number[], unit: Unit) => {
  if (unit.type === 'week-days') {
    values = values.map(value => {
      if (value === 7) {
        return 0;
      }

      return value;
    });
  }

  return values;
};

const outOfRange = (values: number[], unit: Unit) => {
  const first = values[0];
  const last = values[values.length - 1];

  if (first < unit.min) {
    return first;
  } else if (last > unit.max) {
    return last;
  }

  return;
};

const isFull = (values: number[], unit: Unit) => values.length === unit.max - unit.min + 1;

const getStep = (values: number[]) => {
  if (values.length > 2) {
    const step = values[1] - values[0];

    if (step > 1) {
      return step;
    }
  }

  return;
};

const isInterval = (values: number[], step: number) => {
  for (let i = 1; i < values.length; i++) {
    const prev = values[i - 1];
    const value = values[i];

    if (value - prev !== step) {
      return false;
    }
  }

  return true;
};

const isFullInterval = (values: number[], unit: Unit, step: number) => {
  const min = values[0];
  const max = values[values.length - 1];
  const haveAllValues = values.length === (max - min) / step + 1;

  if (min === unit.min && max + step > unit.max && haveAllValues) {
    return true;
  }

  return false;
};

const formatValue = (
  value: number,
  unit: Unit,
  humanize?: boolean,
  leadingZero?: LeadingZero,
  clockFormat?: ClockFormat
) => {
  let cronPartString = value.toString();
  const { type, alt, min } = unit;
  const needLeadingZero = leadingZero && (leadingZero === true || leadingZero.includes(type as any));
  const need24HourClock = clockFormat === '24-hour-clock' && (type === 'hours' || type === 'minutes');

  if ((humanize && type === 'week-days') || (humanize && type === 'months')) {
    cronPartString = alt![value - min];
  } else if (value < 10 && (needLeadingZero || need24HourClock)) {
    cronPartString = cronPartString.padStart(2, '0');
  }

  if (type === 'hours' && clockFormat === '12-hour-clock') {
    const suffix = value >= 12 ? 'PM' : 'AM';
    let hour: number | string = value % 12 || 12;

    if (hour < 10 && needLeadingZero) {
      hour = hour.toString().padStart(2, '0');
    }

    cronPartString = `${hour}${suffix}`;
  }

  return cronPartString;
};

const parsePartArray = (arr: number[], unit: Unit) => {
  const values = [...new Set(fixSunday(arr, unit))].sort();

  if (values.length === 0) {
    return values;
  }

  const value = outOfRange(values, unit);

  if (typeof value !== 'undefined') {
    throw new Error(`Value "${value}" out of range for ${unit.type}`);
  }

  return values;
};

const toRanges = (values: number[]) => {
  const retval: Array<number[] | number> = [];
  let startPart: number | null = null;

  values.forEach((value, index, self) => {
    if (value !== self[index + 1] - 1) {
      if (startPart !== null) {
        retval.push([startPart, value]);
        startPart = null;
      } else {
        retval.push(value);
      }
    } else if (startPart === null) {
      startPart = value;
    }
  });

  return retval;
};

const partToString = (
  cronPart: number[],
  unit: Unit,
  humanize?: boolean,
  leadingZero?: LeadingZero,
  clockFormat?: ClockFormat
) => {
  let retval = '';

  if (isFull(cronPart, unit) || cronPart.length === 0) {
    retval = '*';
  } else {
    const step = getStep(cronPart);

    if (step && isInterval(cronPart, step)) {
      if (isFullInterval(cronPart, unit, step)) {
        retval = `*/${step}`;
      } else {
        retval = `${formatValue(cronPart[0], unit, humanize, leadingZero, clockFormat)}-${formatValue(
          cronPart[cronPart.length - 1],
          unit,
          humanize,
          leadingZero,
          clockFormat
        )}/${step}`;
      }
    } else {
      retval = toRanges(cronPart)
        .map((range: number | number[]) => {
          if (Array.isArray(range)) {
            return `${formatValue(range[0], unit, humanize, leadingZero, clockFormat)}-${formatValue(
              range[1],
              unit,
              humanize,
              leadingZero,
              clockFormat
            )}`;
          }

          return formatValue(range, unit, humanize, leadingZero, clockFormat);
        })
        .join(',');
    }
  }
  return retval;
};

const parseCronArray = (cronArr: number[][], humanize?: boolean) => {
  if (cronArr.length === 5) {
    return cronArr.map((partArr, idx) => {
      const unit = UNITS[idx];
      const parsedArray = parsePartArray(partArr, unit);
      return partToString(parsedArray, unit, humanize);
    });
  }

  throw new Error('Invalid cron array');
};
