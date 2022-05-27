import React, { FC } from 'react';
import { IconButton } from '@grafana/ui';
import { CloseProps } from '@reactour/tour/dist/components/Close';

const Close: FC<CloseProps> = ({ onClick }) => (
  <IconButton style={{ position: 'absolute', right: 0, top: 5, outline: 'none' }} onClick={onClick} name="times" />
);

export default Close;
