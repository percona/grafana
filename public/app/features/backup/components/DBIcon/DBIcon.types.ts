export type DBIconType = 'save' | 'see' | 'delete';

export interface DBIconProps extends React.HTMLAttributes<HTMLOrSVGElement> {
  type: DBIconType;
  size?: number;
}

export interface IconProps {
  size?: number;
}
