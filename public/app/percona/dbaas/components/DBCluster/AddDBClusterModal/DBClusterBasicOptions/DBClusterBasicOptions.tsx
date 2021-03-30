import React, { FC, useCallback, useState, useMemo } from 'react';
import { Field } from 'react-final-form';
import { TextInputField, validators } from '@percona/platform-core';
import { DATABASE_LABELS, Databases } from 'app/percona/shared/core';
import { SelectFieldAdapter, AsyncSelectFieldAdapter } from 'app/percona/shared/components/Form/FieldAdapters';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { DatabaseOption, DBClusterBasicOptionsProps } from './DBClusterBasicOptions.types';
import { DATABASE_OPTIONS } from '../../DBCluster.constants';
import { AddDBClusterFields } from '../AddDBClusterModal.types';
import { DBClusterTopology } from '../DBClusterAdvancedOptions/DBClusterAdvancedOptions.types';
import { getKubernetesOptions, kubernetesClusterNameValidator, optionRequired } from './DBClusterBasicOptions.utils';
import { KubernetesOperatorStatus } from '../../../Kubernetes/OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';
import { SelectableValue } from '@grafana/data';
import { isOptionEmpty } from '../../DBCluster.utils';
import { useDatabaseVersions } from './DBClusterBasicOptions.hooks';

export const DBClusterBasicOptions: FC<DBClusterBasicOptionsProps> = ({ kubernetes, form }) => {
  const { required } = validators;
  const { change } = form;
  const { kubernetesCluster, databaseType } = form.getState().values;
  const [databaseVersions, setDatabaseVersions] = useState<SelectableValue[]>([]);
  const [loadingDatabaseVersions, setLoadingDatabaseVersions] = useState(false);
  const onChangeDatabase = useCallback(databaseType => {
    if (databaseType.value !== Databases.mysql) {
      change(AddDBClusterFields.topology, DBClusterTopology.cluster);
    }

    change(AddDBClusterFields.databaseType, databaseType);
  }, []);

  const kubernetesOptions = getKubernetesOptions(kubernetes);

  const [databaseOptions, setDatabaseOptions] = useState(DATABASE_OPTIONS);
  const onChangeCluster = useCallback(selectedKubernetes => {
    const { operators } = selectedKubernetes;
    const availableDatabaseOptions: DatabaseOption[] = [];

    if (operators.xtradb.status === KubernetesOperatorStatus.ok) {
      availableDatabaseOptions.push({
        value: Databases.mysql,
        label: DATABASE_LABELS[Databases.mysql],
      });
    }

    if (operators.psmdb.status === KubernetesOperatorStatus.ok) {
      availableDatabaseOptions.push({
        value: Databases.mongodb,
        label: DATABASE_LABELS[Databases.mongodb],
      });
    }

    change(AddDBClusterFields.databaseType, {
      value: undefined,
      label: undefined,
    });

    setDatabaseOptions(availableDatabaseOptions);
    change(AddDBClusterFields.kubernetesCluster, selectedKubernetes);
  }, []);

  const isDatabaseVersionDisabled = useMemo(() => isOptionEmpty(databaseType), [databaseType]);

  useDatabaseVersions(form, databaseType, kubernetesCluster, setLoadingDatabaseVersions, setDatabaseVersions);

  return (
    <>
      <TextInputField
        name={AddDBClusterFields.name}
        label={Messages.dbcluster.addModal.fields.clusterName}
        validators={[required, kubernetesClusterNameValidator]}
      />
      <Field
        dataQa="dbcluster-kubernetes-cluster-field"
        name={AddDBClusterFields.kubernetesCluster}
        label={Messages.dbcluster.addModal.fields.kubernetesCluster}
        options={kubernetesOptions}
        component={SelectFieldAdapter}
        noOptionsMessage={Messages.dbcluster.addModal.noOperatorsMessage}
        validate={required}
        onChange={onChangeCluster}
      />
      <Field
        disabled={!form.getState().values[AddDBClusterFields.kubernetesCluster] || !databaseOptions.length}
        dataQa="dbcluster-database-type-field"
        name={AddDBClusterFields.databaseType}
        label={Messages.dbcluster.addModal.fields.databaseType}
        options={databaseOptions}
        component={SelectFieldAdapter}
        validate={optionRequired}
        onChange={onChangeDatabase}
      />
      <Field
        disabled={isDatabaseVersionDisabled}
        dataQa="dbcluster-database-version-field"
        name={AddDBClusterFields.databaseVersion}
        label={Messages.dbcluster.addModal.fields.databaseVersion}
        component={AsyncSelectFieldAdapter}
        loading={loadingDatabaseVersions}
        options={databaseVersions}
        validate={optionRequired}
      />
    </>
  );
};
