import React, { FC, useMemo } from 'react';

import { Card, Icon, useStyles2 } from '@grafana/ui';
import { Databases } from 'app/percona/shared/core';

import { InstanceTypesExtra, InstanceAvailableType } from '../../panel.types';

import { Messages } from './AddInstance.messages';
import { getStyles } from './AddInstance.styles';
import { AddInstanceProps, InstanceListItem, SelectInstanceProps } from './AddInstance.types';

export const SelectInstance: FC<SelectInstanceProps> = ({ type, isSelected, icon, selectInstanceType, title }) => {
  const styles = useStyles2(getStyles);

  return (
    <Card
      data-testid={`${type}-instance`}
      isSelected={isSelected}
      onClick={selectInstanceType(type)}
      className={styles.InstanceCard}
    >
      <Card.Heading>{title}</Card.Heading>
      <Card.Description>{Messages.titles.addInstance}</Card.Description>
      <Card.Figure>
        <Icon size="xxxl" name={icon ? icon : 'database'} />
      </Card.Figure>
    </Card>
  );
};

export const AddInstance: FC<AddInstanceProps> = ({ selectedInstanceType, onSelectInstanceType, showAzure }) => {
  const styles2 = useStyles2(getStyles);
  const instanceList = useMemo<InstanceListItem[]>(
    () => [
      { type: Databases.postgresql, title: Messages.titles.postgresql, icon: 'percona-database-postgresql' },
      { type: Databases.mysql, title: Messages.titles.mysql, icon: 'percona-database-mysql' },
      { type: Databases.mongodb, title: Messages.titles.mongodb, icon: 'percona-database-mongodb' },
      { type: Databases.proxysql, title: Messages.titles.proxysql, icon: 'percona-database-proxysql' },
      { type: Databases.haproxy, title: Messages.titles.haproxy, icon: 'percona-database-haproxy' },
      { type: InstanceTypesExtra.rds, title: Messages.titles.rds },
      { type: InstanceTypesExtra.external, title: Messages.titles.external },
      { type: InstanceTypesExtra.azure, title: Messages.titles.azure, isHidden: !showAzure },
    ],
    [showAzure]
  );

  const selectInstanceType = (type: InstanceAvailableType) => () => onSelectInstanceType({ type });

  return (
    <section className={styles2.Content}>
      <h2>{Messages.sectionTitle}</h2>
      <p className={styles2.Description}>{Messages.description}</p>
      <nav className={styles2.NavigationPanel}>
        {instanceList
          .filter(({ isHidden }) => !isHidden)
          .map((item) => (
            <SelectInstance
              isSelected={item.type === selectedInstanceType.type}
              selectInstanceType={selectInstanceType}
              type={item.type}
              icon={item.icon}
              title={item.title}
              key={item.type}
            />
          ))}
      </nav>
    </section>
  );
};
