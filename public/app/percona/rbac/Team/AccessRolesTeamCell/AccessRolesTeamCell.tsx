import React, { FC } from 'react';

import AccessRolesTeamSelect from '../AccessRolesTeamSelect';

const AccessRolesTeamCell: FC = () => {
  return (
    <td>
      <AccessRolesTeamSelect id={0} name={''} />
    </td>
  );
};

export default AccessRolesTeamCell;
