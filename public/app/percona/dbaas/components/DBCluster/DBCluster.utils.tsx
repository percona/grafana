import React from 'react';
import { SelectableValue } from '@grafana/data';
import { Messages } from 'app/percona/dbaas/DBaaS.messages';
import { Databases } from 'app/percona/shared/core';
import {
  DBCluster,
  DBClusterExpectedResources,
  DBClusterStatus,
  ResourcesUnits,
  ResourcesWithUnits,
} from './DBCluster.types';
import { ADVANCED_SETTINGS_URL, SERVICE_MAP, THOUSAND } from './DBCluster.constants';
import { DBClusterService } from './DBCluster.service';

export const isClusterChanging = ({ status }: DBCluster) => {
  const isChanging = status === DBClusterStatus.changing || status === DBClusterStatus.deleting;

  return isChanging;
};

export const buildWarningMessage = (className: string) => (
  <>
    {Messages.dbcluster.publicAddressWarningBegin}
    &nbsp;
    <a href={ADVANCED_SETTINGS_URL} className={className}>
      {Messages.dbcluster.publicAddressWarningLink}
    </a>
    &nbsp;
    {Messages.dbcluster.publicAddressWarningEnd}
  </>
);

export const newDBClusterService = (type: Databases): DBClusterService => {
  const service = SERVICE_MAP[type] as DBClusterService;

  return service || SERVICE_MAP[Databases.mysql];
};

export const isOptionEmpty = (option?: SelectableValue) => !option || Object.keys(option).length === 0 || !option.value;

export const formatResources = (bytes: number, decimals: number): ResourcesWithUnits => {
  const i = Math.floor(Math.log(bytes) / Math.log(THOUSAND));
  const units = Object.values(ResourcesUnits)[i];

  return { value: parseFloat((bytes / Math.pow(THOUSAND, i)).toFixed(decimals)), units, original: bytes };
};

export const getResourcesDifference = (
  { value: valueA, original: originalA, units: unitsA }: ResourcesWithUnits,
  { value: valueB, original: originalB, units: unitsB }: ResourcesWithUnits
): ResourcesWithUnits | null => {
  if (unitsA !== unitsB) {
    return null;
  }

  return {
    original: originalA - originalB,
    value: valueA - valueB,
    units: unitsA,
  };
};

export const getResourcesSum = (
  { value: valueA, original: originalA, units: unitsA }: ResourcesWithUnits,
  { value: valueB, original: originalB, units: unitsB }: ResourcesWithUnits
): ResourcesWithUnits | null => {
  if (unitsA !== unitsB) {
    return null;
  }

  return {
    original: originalA + originalB,
    value: valueA + valueB,
    units: unitsA,
  };
};

export const getExpectedResourcesDifference = (
  { expected: { cpu: cpuA, memory: memoryA, disk: diskA } }: DBClusterExpectedResources,
  { expected: { cpu: cpuB, memory: memoryB, disk: diskB } }: DBClusterExpectedResources
): DBClusterExpectedResources => {
  return {
    expected: {
      cpu: getResourcesDifference(cpuA, cpuB) as ResourcesWithUnits,
      memory: getResourcesDifference(memoryA, memoryB) as ResourcesWithUnits,
      disk: getResourcesDifference(diskA, diskB) as ResourcesWithUnits,
    },
  };
};

export const formatDBClusterVersion = (version?: string) => (version ? version.split(':')[1].split('-')[0] : '');

export const formatDBClusterVersionWithBuild = (version?: string) => (version ? version.split(':')[1] : '');
