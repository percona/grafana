import { Interval } from 'app/percona/check/types';

export const checkIntervalOptions = Object.keys(Interval).map(intervalKey => ({
  value: intervalKey,
  label: Interval[intervalKey as keyof typeof Interval],
}));

// export const checkIntervalOptions = [
//   { value: Interval.STANDARD, label: Interval.STANDARD },
//   { value: Interval.RARE, label: Interval.RARE },
//   { value: Interval.FREQUENT, label: Interval.FREQUENT },
// ];
