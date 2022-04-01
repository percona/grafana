/* eslint-disable react/display-name */
import React, { useMemo, useState } from 'react';
import { Button, useStyles } from '@grafana/ui';
import { cx } from '@emotion/css';
import Page from 'app/core/components/Page/Page';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import AddRemoteInstance from './components/AddRemoteInstance/AddRemoteInstance';
import Discovery from './components/Discovery/Discovery';
import AzureDiscovery from './components/AzureDiscovery/Discovery';
import { AddInstance } from './components/AddInstance/AddInstance';
import { getStyles } from './panel.styles';
import { Messages } from './components/AddRemoteInstance/AddRemoteInstance.messages';
import { InstanceTypesExtra, InstanceAvailable, AvailableTypes } from './panel.types';
import { Databases } from '../../percona/shared/core';

const availableInstanceTypes: AvailableTypes[] = [
  InstanceTypesExtra.rds,
  InstanceTypesExtra.azure,
  Databases.postgresql,
  Databases.mysql,
  Databases.proxysql,
  Databases.mongodb,
  InstanceTypesExtra.external,
  Databases.haproxy,
];

const AddInstancePanel = () => {
  const styles = useStyles(getStyles);
  const instanceType = '';
  const [selectedInstance, selectInstance] = useState<InstanceAvailable>({
    type: availableInstanceTypes.includes(instanceType as AvailableTypes) ? instanceType : '',
  });
  const navModel = usePerconaNavModel('add-instance');

  const InstanceForm = useMemo(
    () => () => (
      <>
        {selectedInstance.type !== InstanceTypesExtra.rds && selectedInstance.type !== InstanceTypesExtra.azure && (
          <div className={styles.content}>
            <Button
              variant="secondary"
              onClick={() => selectInstance({ type: '' })}
              className={styles.returnButton}
              icon="arrow-left"
            >
              {Messages.form.buttons.toMenu}
            </Button>
          </div>
        )}
        {selectedInstance.type === InstanceTypesExtra.rds && <Discovery selectInstance={selectInstance} />}
        {selectedInstance.type === InstanceTypesExtra.azure && <AzureDiscovery selectInstance={selectInstance} />}
        {selectedInstance.type !== InstanceTypesExtra.rds && selectedInstance.type !== InstanceTypesExtra.azure && (
          <AddRemoteInstance instance={selectedInstance} selectInstance={selectInstance} />
        )}
      </>
    ),
    [selectedInstance, styles.content, styles.returnButton]
  );

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <div className={cx(styles.content)}>
          {!selectedInstance.type ? <AddInstance onSelectInstanceType={selectInstance} /> : <InstanceForm />}
        </div>
      </Page.Contents>
    </Page>
  );
};

export default AddInstancePanel;
