import { Interval } from 'pmm-check/types';

export const checkIntervalOptions = Object.keys(Interval).map(intervalKey => ({
  value: intervalKey,
  label: Interval[intervalKey],
}));

// export const checkIntervalOptions = [
//   { value: Interval.STANDARD, label: Interval.STANDARD },
//   { value: Interval.RARE, label: Interval.RARE },
//   { value: Interval.FREQUENT, label: Interval.FREQUENT },
// ];
