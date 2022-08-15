import { TextInputField, validators } from '@percona/platform-core';
import React, { FC, useCallback, useState, useMemo } from 'react';
import { Field } from 'react-final-form';

import { SelectableValue } from '@grafana/data';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import {
  SelectFieldAdapter,
  AsyncSelectFieldAdapter,
} from 'app/percona/shared/components/Form/FieldAdapters/FieldAdapters';
import { Databases } from 'app/percona/shared/core';

import { Kubernetes, Operator } from '../../../Kubernetes/Kubernetes.types';
import { getDatabaseOptionFromOperator } from '../../../Kubernetes/Kubernetes.utils';
import { KubernetesOperatorStatus } from '../../../Kubernetes/OperatorStatusItem/KubernetesOperatorStatus/KubernetesOperatorStatus.types';
import { DATABASE_OPTIONS } from '../../DBCluster.constants';
import { isOptionEmpty } from '../../DBCluster.utils';
import { AddDBClusterFields } from '../AddDBClusterModal.types';
import { DBClusterTopology } from '../DBClusterAdvancedOptions/DBClusterAdvancedOptions.types';

import { CLUSTER_NAME_MAX_LENGTH } from './DBClusterBasicOptions.constants';
import { useDatabaseVersions } from './DBClusterBasicOptions.hooks';
import { DatabaseOption, DBClusterBasicOptionsProps, Operators } from './DBClusterBasicOptions.types';
import { getKubernetesOptions, kubernetesClusterNameValidator, optionRequired } from './DBClusterBasicOptions.utils';

const getAvailableDatabaseOptions = (kubernetesCluster: Kubernetes): DatabaseOption[] => {
  const { operators } = kubernetesCluster;
  const availableDatabaseOptions: DatabaseOption[] = [];

  Object.entries(operators).forEach(([operator, { status }]: [string, Operator]) => {
    if (status === KubernetesOperatorStatus.ok) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      availableDatabaseOptions.push(getDatabaseOptionFromOperator(operator as Operators) as DatabaseOption);
    }
  });

  return availableDatabaseOptions;
};

export const DBClusterBasicOptions: FC<DBClusterBasicOptionsProps> = ({ kubernetes, form }) => {
  const { required, maxLength } = validators;
  const { change } = form;
  const { kubernetesCluster, databaseType } = form.getState().values;
  const [databaseVersions, setDatabaseVersions] = useState<SelectableValue[]>([]);
  const [loadingDatabaseVersions, setLoadingDatabaseVersions] = useState(false);
  const onChangeDatabase = useCallback((databaseType) => {
    if (databaseType.value !== Databases.mysql) {
      change(AddDBClusterFields.topology, DBClusterTopology.cluster);
    }

    change(AddDBClusterFields.databaseType, databaseType);
    form.mutators.setClusterName(databaseType.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const kubernetesOptions = getKubernetesOptions(kubernetes);

  const [databaseOptions, setDatabaseOptions] = useState(() => {
    if (kubernetesCluster) {
      const availableDatabaseOptions = getAvailableDatabaseOptions(kubernetesCluster);
      return availableDatabaseOptions;
    }
    return DATABASE_OPTIONS;
  });

  const onChangeCluster = useCallback((selectedKubernetes) => {
    const availableDatabaseOptions = getAvailableDatabaseOptions(selectedKubernetes);

    if (availableDatabaseOptions.length === 1) {
      change(AddDBClusterFields.databaseType, availableDatabaseOptions[0]);
    } else {
      change(AddDBClusterFields.databaseType, {
        value: undefined,
        label: undefined,
      });
    }

    setDatabaseOptions(availableDatabaseOptions);
    change(AddDBClusterFields.kubernetesCluster, selectedKubernetes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDatabaseVersionDisabled = useMemo(() => isOptionEmpty(databaseType), [databaseType]);

  useDatabaseVersions(form, databaseType, kubernetesCluster, setLoadingDatabaseVersions, setDatabaseVersions);

  return (
    <>
      <Field
        dataTestId="dbcluster-kubernetes-cluster-field"
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
        dataTestId="dbcluster-database-type-field"
        name={AddDBClusterFields.databaseType}
        label={Messages.dbcluster.addModal.fields.databaseType}
        options={databaseOptions}
        component={SelectFieldAdapter}
        validate={optionRequired}
        onChange={onChangeDatabase}
      />
      <Field
        disabled={isDatabaseVersionDisabled}
        dataTestId="dbcluster-database-version-field"
        name={AddDBClusterFields.databaseVersion}
        label={Messages.dbcluster.addModal.fields.databaseVersion}
        component={AsyncSelectFieldAdapter}
        loading={loadingDatabaseVersions}
        options={databaseVersions}
        validate={optionRequired}
      />
      <TextInputField
        name={AddDBClusterFields.name}
        label={Messages.dbcluster.addModal.fields.clusterName}
        validators={[required, kubernetesClusterNameValidator, maxLength(CLUSTER_NAME_MAX_LENGTH)]}
      />
    </>
  );
};
