import { UseFormRegister } from 'react-hook-form';

import { AddEditFormValues } from '../AddEditRoleForm';

export interface LabelsFieldProps {
  placeholder: string;
  register: UseFormRegister<AddEditFormValues>;
}
