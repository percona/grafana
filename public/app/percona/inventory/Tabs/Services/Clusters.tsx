import React, { FC, useMemo } from 'react';

import ClusterItem from './ClusterItem';
import { ClustersProps } from './Clusters.type';
import { getClustersFromServices } from './Clusters.utils';

const Clusters: FC<ClustersProps> = ({ services, onDelete }) => {
  const clusters = useMemo(() => getClustersFromServices(services), [services]);

  return (
    <div>
      {clusters.map((cluster) => (
        <ClusterItem key={cluster.name} cluster={cluster} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default Clusters;
