import moment from 'moment/moment';

import { AgentType } from 'app/percona/inventory/Inventory.types';
import { AdvisorRunIntervalsSettings } from 'app/percona/settings/Settings.types';
import { Service } from 'app/percona/shared/services/services/Services.types';

import {
  HOURS,
  MINUTES_IN_HOUR,
  PMM_SERVER_AGENT_NODE_ID,
  PMM_SERVER_AGENT_SERVICE_NAME,
  SECONDS_IN_DAY,
} from './Advanced.constants';

export const convertSecondsToDays = (dataRetention: string) => {
  const [count, units] = [+dataRetention.slice(0, -1), dataRetention.slice(-1)];

  switch (units) {
    case 'h':
      return count / HOURS;
    case 'm':
      return count / MINUTES_IN_HOUR;
    case 's':
      return count / SECONDS_IN_DAY;
    default:
      return '';
  }
};

export const convertSecondsStringToHour = (seconds: string) =>
  moment.duration(parseInt(seconds, 10), 'seconds').asHours();

export const convertHoursStringToSeconds = (hours: string) => moment.duration(parseFloat(hours), 'hours').asSeconds();

export const convertCheckIntervalsToHours = (sttCheckIntervals: AdvisorRunIntervalsSettings) => {
  const {
    rareInterval: rawRareInterval,
    standardInterval: rawStandardInterval,
    frequentInterval: rawFrequentInterval,
  } = sttCheckIntervals;
  return {
    rareInterval: `${convertSecondsStringToHour(rawRareInterval)}`,
    standardInterval: `${convertSecondsStringToHour(rawStandardInterval)}`,
    frequentInterval: `${convertSecondsStringToHour(rawFrequentInterval)}`,
  };
};
