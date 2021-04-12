import { logger } from '@percona/platform-core';
import { useRef, useEffect } from 'react';

type hookRecurringCallback = () => void;

export const useRecurringCall = () => {
  const timer = useRef<number>();
  const interval = useRef<number>();

  const triggerTimeout = async (cb: hookRecurringCallback, defaultInterval = 10000, callImmediate = false) => {
    callImmediate && (await cb());
    interval.current = defaultInterval;
    timer.current = window.setTimeout(async () => {
      try {
        await cb();
      } catch (e) {
        logger.error(e);
      }
      triggerTimeout(cb, interval.current);
    }, interval.current);
  };

  const changeInterval = (newInterval: number) => {
    interval.current = newInterval;
  };

  const stopTimeout = () => {
    window.clearTimeout(timer.current);
  };

  useEffect(() => {
    return stopTimeout;
  }, []);

  return [triggerTimeout, changeInterval, stopTimeout] as const;
};
