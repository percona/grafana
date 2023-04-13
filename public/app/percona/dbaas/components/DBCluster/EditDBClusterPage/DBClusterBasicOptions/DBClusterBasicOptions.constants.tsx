import { DATABASE_LABELS, Databases } from 'app/percona/shared/core';

import { Operators } from './DBClusterBasicOptions.types';

export const OPERATORS = [Operators.pxc, Operators.psmdb, Operators.pg];

export const DatabaseOperatorsLabels = {
  [Operators.pxc]: DATABASE_LABELS[Databases.mysql],
  [Operators.psmdb]: DATABASE_LABELS[Databases.mongodb],
  [Operators.pg]: DATABASE_LABELS[Databases.postgresql],
};

export const CLUSTER_NAME_MAX_LENGTH = 20;
