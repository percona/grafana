import React, { FC } from 'react';

import { AccessRolesUserSelect } from '../user';

interface AccessRoleCellProps {
  userId: number;
  name: string;
}

const AccessRoleCell: FC<AccessRoleCellProps> = ({ userId, name }) => (
  <td>
    <AccessRolesUserSelect id={userId} name={name} />
  </td>
);

export default AccessRoleCell;
