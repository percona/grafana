import React, { FC } from 'react';
import { DBIconProps, DBIconMap } from './DBIcon.types';
import { Edit, Delete, See, Restore } from './assets';

const Icons: DBIconMap = {
  edit: Edit,
  delete: Delete,
  see: See,
  restore: Restore,
};

export const DBIcon: FC<DBIconProps> = ({ type, size, ...rest }) => {
  const Icon = Icons[type];
  return Icon ? <Icon size={size} {...rest} /> : null;
};
