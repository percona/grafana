/* eslint-disable react/display-name */
import React, { FC, useMemo } from 'react';
import { Modal } from '@percona/platform-core';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { useStyles } from '@grafana/ui';
import { StepProgress } from 'app/percona/dbaas/components/StepProgress/StepProgress';
import { AddDBClusterModalProps, AddDBClusterFields } from './AddDBClusterModal.types';
import { DBClusterBasicOptions } from './DBClusterBasicOptions/DBClusterBasicOptions';
import { DBClusterAdvancedOptions } from './DBClusterAdvancedOptions/DBClusterAdvancedOptions';
import { getStyles } from './AddDBClusterModal.styles';
import { FormRenderProps } from 'react-final-form';
import { PMMServerUrlWarning } from '../../PMMServerURLWarning/PMMServerUrlWarning';
import { useSelector } from 'react-redux';
import { getAddDbCluster } from 'app/percona/shared/core/selectors';
import { useShowPMMAddressWarning } from 'app/percona/shared/components/hooks/showPMMAddressWarning';
import { getInitialValues, updateDatabaseClusterNameInitialValue } from './AddDBClusterModal.utils';

export const AddDBClusterModal: FC<AddDBClusterModalProps> = ({ kubernetes, isVisible, setVisible, onSubmit }) => {
  const styles = useStyles(getStyles);
  const { loading } = useSelector(getAddDbCluster);
  const [showPMMAddressWarning] = useShowPMMAddressWarning();

  const initialValues = useMemo(() => getInitialValues(kubernetes), [kubernetes]);
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
        render: (renderProps) => <DBClusterAdvancedOptions {...renderProps} />,
        dataTestId: 'dbcluster-advanced-options-step',
      },
    ],
    [kubernetes]
  );

  return (
    <div className={styles.modalWrapper} key="add-db-cluster-modal">
      <Modal title={Messages.dbcluster.addModal.title} isVisible={isVisible} onClose={() => setVisible(false)}>
        <div className={styles.stepProgressWrapper}>
          {showPMMAddressWarning && <PMMServerUrlWarning />}
          <StepProgress
            steps={steps}
            initialValues={updatedItialValues}
            submitButtonMessage={Messages.dbcluster.addModal.confirm}
            onSubmit={(values) => onSubmit(values, showPMMAddressWarning)}
            loading={loading}
          />
        </div>
      </Modal>
    </div>
  );
};
