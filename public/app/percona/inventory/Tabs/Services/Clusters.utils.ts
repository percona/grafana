import { Databases } from 'app/percona/shared/core';

import { FlattenService } from '../../Inventory.types';

import { ServicesCluster } from './Clusters.type';

export const getClustersFromServices = (services: FlattenService[]): ServicesCluster[] => {
  const clusterNames = [...new Set(services.map((s) => s.cluster || s.serviceName))];
  return clusterNames.map<ServicesCluster>((clusterName) => {
    const clusterServices = services.filter((s) =>
      s.cluster ? s.cluster === clusterName : s.serviceName === clusterName
    );

    return {
      name: clusterName,
      type: clusterServices[0]?.type as Databases,
      services: clusterServices,
    };
  });
};
