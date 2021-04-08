import { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';

export const useCancelToken = () => {
  const [tokens, setTokens] = useState<Record<string, CancelTokenSource>>({});

  const generateToken = (sourceName: string) => {
    tokens[sourceName] && tokens[sourceName].cancel();
    const tokenSource = axios.CancelToken.source();
    setTokens(tokens => ({ ...tokens, [sourceName]: tokenSource }));
    return tokenSource.token;
  };

  useEffect(() => {
    return function cleanup() {
      for (let source in tokens) {
        tokens[source].cancel();
      }
    };
  }, [tokens]);

  return [generateToken] as const;
};
