/* eslint-disable react/display-name,@typescript-eslint/consistent-type-assertions,@typescript-eslint/no-explicit-any */
import { cx } from '@emotion/css';
import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Button, useStyles2 } from '@grafana/ui';
import { OldPage } from 'app/core/components/Page/Page';
import { usePerconaNavModel } from 'app/percona/shared/components/hooks/perconaNavModel';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';

import { Databases } from '../../percona/shared/core';
import { FeatureLoader } from '../shared/components/Elements/FeatureLoader';

import { AddInstance } from './components/AddInstance/AddInstance';
import AddRemoteInstance from './components/AddRemoteInstance/AddRemoteInstance';
import { Messages } from './components/AddRemoteInstance/AddRemoteInstance.messages';
import AzureDiscovery from './components/AzureDiscovery/Discovery';
import Discovery from './components/Discovery/Discovery';
import { getStyles } from './panel.styles';
import { InstanceTypesExtra, InstanceAvailable, AvailableTypes } from './panel.types';

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
  const styles = useStyles2(getStyles);
  const { result: settings } = useSelector(getPerconaSettings);
  const { azureDiscoverEnabled } = settings!;
  const instanceType = '';
  const [selectedInstance, selectInstance] = useState<InstanceAvailable>({
    type: availableInstanceTypes.includes(instanceType as AvailableTypes) ? instanceType : '',
  });
  const navModel = usePerconaNavModel('add-instance');

  const InstanceForm = useMemo(
    () => () =>
      (
        <>
          {selectedInstance.type !== InstanceTypesExtra.rds && selectedInstance.type !== InstanceTypesExtra.azure && (
            <Button
              variant="secondary"
              className={styles.returnButton}
              onClick={() => selectInstance({ type: '' })}
              icon="arrow-left"
            >
              {Messages.form.buttons.toMenu}
            </Button>
          )}
          {selectedInstance.type === InstanceTypesExtra.rds && <Discovery selectInstance={selectInstance} />}
          {selectedInstance.type === InstanceTypesExtra.azure && <AzureDiscovery selectInstance={selectInstance} />}
          {selectedInstance.type !== InstanceTypesExtra.rds && selectedInstance.type !== InstanceTypesExtra.azure && (
            <AddRemoteInstance instance={selectedInstance} selectInstance={selectInstance} />
          )}
        </>
      ),
    [selectedInstance, styles.returnButton]
  );

  return (
    <OldPage navModel={navModel}>
      <OldPage.Contents>
        <FeatureLoader>
          <div className={cx(styles.content)}>
            {!selectedInstance.type ? (
              <AddInstance showAzure={!!azureDiscoverEnabled} onSelectInstanceType={selectInstance} />
            ) : (
              <InstanceForm />
            )}
          </div>
        </FeatureLoader>
      </OldPage.Contents>
    </OldPage>
  );
};

export default AddInstancePanel;
