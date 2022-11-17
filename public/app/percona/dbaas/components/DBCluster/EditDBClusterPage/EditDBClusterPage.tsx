/* eslint-disable react/display-name */
import React, { FC, useMemo, useState } from 'react';
import { FormRenderProps } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { logger } from '@percona/platform-core';

import { useStyles } from '@grafana/ui/src';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { StepProgress } from 'app/percona/dbaas/components/StepProgress/StepProgress';
import { useShowPMMAddressWarning } from 'app/percona/shared/components/hooks/showPMMAddressWarning';
import { getAddDbCluster, getKubernetes } from 'app/percona/shared/core/selectors';

import { PMMServerUrlWarning } from '../../PMMServerURLWarning/PMMServerUrlWarning';

import { getStyles } from './EditDBClusterPage.styles';
import { AddDBClusterModalProps, AddDBClusterFields } from './EditDBClusterPage.types';
import { getInitialValues, updateDatabaseClusterNameInitialValue } from './EditDBClusterPage.utils';
import { DBClusterAdvancedOptions } from './DBClusterAdvancedOptions/DBClusterAdvancedOptions';
import { DBClusterBasicOptions } from './DBClusterBasicOptions/DBClusterBasicOptions';
import { UnsafeConfigurationWarning } from './UnsafeConfigurationsWarning/UnsafeConfigurationWarning';
import { addDbClusterAction } from '../../../../shared/core/reducers';

export const EditDBClusterPage: FC<AddDBClusterModalProps> = ({
  kubernetes,
  onSubmit,
  preSelectedKubernetesCluster,
  mode,
}) => {
  const dispatch = useDispatch();
  const styles = useStyles(getStyles);
  const { loading } = useSelector(getAddDbCluster);
  const [showPMMAddressWarning] = useShowPMMAddressWarning();
  const [showUnsafeConfigurationWarning, setShowUnsafeConfigurationWarning] = useState(false);

  const addCluster = async (values: Record<string, any>, showPMMAddressWarning: boolean) => {
    try {
      await dispatch(addDbClusterAction({ values, setPMMAddress: showPMMAddressWarning })).unwrap();
      // setAddModalVisible(false);
      getDBClusters(true);
    } catch (e) {
      logger.error(e);
    }
  };

  const initialValues = useMemo(
    () => getInitialValues(kubernetes, preSelectedKubernetesCluster),
    [kubernetes, preSelectedKubernetesCluster]
  );

  const updatedItialValues = useMemo(
    () => (isVisible ? updateDatabaseClusterNameInitialValue(initialValues) : initialValues),
    [initialValues, isVisible]
  );

  const steps = useMemo(
    () => [
      {
        title: Messages.dbcluster.addModal.steps.basicOptions,
        fields: [AddDBClusterFields.name, AddDBClusterFields.kubernetesCluster, AddDBClusterFields.databaseType],
        render: ({ form }: FormRenderProps) => <DBClusterBasicOptions kubernetes={kubernetes} form={form} />,
        dataTestId: 'dbcluster-basic-options-step',
      },
      {
        title: Messages.dbcluster.addModal.steps.advancedOptions,
        fields: [
          AddDBClusterFields.topology,
          AddDBClusterFields.nodes,
          AddDBClusterFields.memory,
          AddDBClusterFields.cpu,
          AddDBClusterFields.disk,
        ],
        render: (renderProps) => (
          <DBClusterAdvancedOptions
            setShowUnsafeConfigurationWarning={setShowUnsafeConfigurationWarning}
            {...renderProps}
          />
        ),
        dataTestId: 'dbcluster-advanced-options-step',
      },
    ],
    [kubernetes]
  );

  return (
    <div className={styles.modalWrapper} key="add-db-cluster-modal">
      {/*<Modal title={Messages.dbcluster.addModal.title} isVisible={isVisible} onClose={() => setVisible(false)}>*/}
      <div className={styles.stepProgressWrapper}>
        {showPMMAddressWarning && <PMMServerUrlWarning />}
        {showUnsafeConfigurationWarning && <UnsafeConfigurationWarning />}
        <StepProgress
          steps={steps}
          initialValues={updatedItialValues}
          submitButtonMessage={Messages.dbcluster.addModal.confirm}
          onSubmit={(values) => onSubmit(values, showPMMAddressWarning)}
          loading={loading}
        />
      </div>
      {/*</Modal>*/}
    </div>
  );
};
