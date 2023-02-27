import React, { FC } from 'react';

import { HorizontalGroup, Icon, IconName } from '@grafana/ui';
import { DATABASE_ICONS } from 'app/percona/shared/core';

import { ServiceIconWithTextProps } from './ServiceIconWithText.types';

export const ServiceIconWithText: FC<ServiceIconWithTextProps> = ({ dbType, text }) => {
  // @ts-ignore
  const icon: IconName = DATABASE_ICONS[dbType];

  return icon ? (
    <HorizontalGroup>
      <Icon name={icon} />
      <span>{text}</span>
    </HorizontalGroup>
  ) : null;
};
