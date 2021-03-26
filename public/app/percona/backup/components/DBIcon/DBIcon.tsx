import React, { FC } from 'react';
import { DBIconProps, DBIconMap } from './DBIcon.types';
import { Edit, Delete, See, Backup } from './assets';

const Icons: DBIconMap = {
  edit: Edit,
  delete: Delete,
  see: See,
  backup: Backup,
};

export const DBIcon: FC<DBIconProps> = ({ type, size, ...rest }) => {
  const Icon = Icons[type];
  return Icon ? <Icon size={size} {...rest} /> : null;
};
