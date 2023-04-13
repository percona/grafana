import { Databases } from '../../../../../../shared/core';

export enum NetworkAndSecurityFields {
  expose = 'expose',
  internetFacing = 'internetFacing',
  sourceRanges = 'sourceRanges',
}

export interface NetworkAndSecurityProps {
  databaseType: Databases;
}
