import React from 'react';
import { EmptyBlock } from '../../../EmptyBlock';
import { ErrorMessageProps } from './ErrorMessage.types';

export const ErrorMessage = ({ dataTestId, message }: ErrorMessageProps) => {
  return <EmptyBlock dataTestId={dataTestId}>{message}</EmptyBlock>;
};
