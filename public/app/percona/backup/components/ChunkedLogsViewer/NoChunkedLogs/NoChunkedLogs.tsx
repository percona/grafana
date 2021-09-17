import React, { FC } from 'react';
import { Messages } from '../ChunkedLogsViewer.messages';
import { NoChunkedLogsProps } from './NoChunkedLogs.types';

export const NoChunkedLogs: FC<NoChunkedLogsProps> = ({ endOfStream }) => {
  if (endOfStream) {
    return <>{Messages.noLogs}</>;
  }

  return <>{Messages.pleaseRefresh}</>;
};
