import React, { FC } from 'react';
import { toPascalCase } from '@grafana/data';
import { DBIconProps } from './DBIcon.types';
import * as Icons from './assets';

export const DBIcon: FC<DBIconProps> = ({ type, size, ...rest }) => {
  //@ts-ignore
  const Icon = Icons[toPascalCase(type)];
  return Icon ? <Icon size={size} {...rest} /> : null;
};
