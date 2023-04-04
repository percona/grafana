export interface AccessRolesSelectProps {
  label: string;
  isLoading: boolean;
  roleIds: number[];
  allowEmpty?: boolean;
  onChange: (ids: number[]) => void;
}
