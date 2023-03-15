export enum NetworkAndSecurityFields {
  expose = 'expose',
  internetFacing = 'internetFacing',
  sourceRanges = 'sourceRanges',
}

export interface NetworkAndSecurityProps {
  [NetworkAndSecurityFields.expose]?: boolean;
  [NetworkAndSecurityFields.sourceRanges]?: Array<{ sourceRange: string }> | [];
  [NetworkAndSecurityFields.internetFacing]?: boolean;
}
