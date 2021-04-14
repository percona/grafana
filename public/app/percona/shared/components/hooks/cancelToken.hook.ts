import { useRef, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

export const useCancelToken = () => {
  const tokens = useRef<Record<string, CancelTokenSource>>({});

  const generateToken = (sourceName: string) => {
    tokens.current[sourceName] && tokens.current[sourceName].cancel();
    const tokenSource = axios.CancelToken.source();
    tokens.current = { ...tokens.current, [sourceName]: tokenSource };
    return tokenSource.token;
  };

  useEffect(
    () => () => {
      for (const source in tokens.current) {
        tokens.current[source].cancel();
      }
    },
    []
  );

  return [generateToken] as const;
};
