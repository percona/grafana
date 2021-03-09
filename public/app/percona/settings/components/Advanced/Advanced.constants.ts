import { Messages } from 'app/percona/settings/Settings.messages';
import { SttCheckIntervals } from 'app/percona/settings/Settings.types';

export const SECONDS = 60;
export const MINUTES = 60;
export const HOURS = 24;
export const SECONDS_IN_DAY = SECONDS * MINUTES * HOURS;
export const SECONDS_IN_HOUR = 3600;
export const MINUTES_IN_HOUR = MINUTES * HOURS;
export const MIN_DAYS = 1;
export const MAX_DAYS = 3650;
export const MIN_STT_CHECK_INTERVAL = 0.01;

const {
  advanced: { sttRareIntervalLabel, sttStandardIntervalLabel, sttFrequentIntervalLabel },
} = Messages;

export const STT_CHECK_INTERVALS = [
  {
    label: sttRareIntervalLabel,
    name: SttCheckIntervals.rareInterval,
  },
  {
    label: sttStandardIntervalLabel,
    name: SttCheckIntervals.standardInterval,
  },
  {
    label: sttFrequentIntervalLabel,
    name: SttCheckIntervals.frequentInterval,
  },
];
