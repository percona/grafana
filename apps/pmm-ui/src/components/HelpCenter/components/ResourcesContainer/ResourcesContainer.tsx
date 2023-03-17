import React, { FC } from 'react';
import { IconName } from '@grafana/ui';
import { Resource } from '../Resource';
import resourcesData from './stub/resources.json'; //todo

export const ResourcesContainer: FC = () => (
  <div>
    {resourcesData.map((r) => (
      <Resource
        key={r.id}
        icon={r.icon as IconName}
        title={r.title}
        text={r.text}
        buttonText={r.buttonText}
        url={r.url}
      />
    ))}
  </div>
);
