export type DBIconType = 'save' | 'see' | 'delete';

export interface DBIconProps {
  type: DBIconType;
  size?: number;
}

export interface IconProps {
  size?: number;
}
