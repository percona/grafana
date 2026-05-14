import { NavIndex, NavModelItem } from '@grafana/data';

import { PMM_ACCESS_ROLES_PAGE } from './PerconaNavigation.constants';
import { buildUsersAndAccessNavWithRoles, GRAFANA_NAV_ID_USERS_AND_ACCESS } from './PerconaNavigation.utils';

const usersAndAccessSection: NavModelItem = {
  id: GRAFANA_NAV_ID_USERS_AND_ACCESS,
  text: 'Users and access',
};

describe('buildUsersAndAccessNavWithRoles', () => {
  it('returns undefined when Users and access section is missing', () => {
    expect(buildUsersAndAccessNavWithRoles({})).toBeUndefined();
  });

  it('appends PMM Access Roles as a child of cfg/access', () => {
    const navTree: NavIndex = {
      [GRAFANA_NAV_ID_USERS_AND_ACCESS]: {
        ...usersAndAccessSection,
        children: [{ id: 'global-users', text: 'Users' }],
      },
    };

    const result = buildUsersAndAccessNavWithRoles(navTree);

    expect(result?.children?.map((c) => c.id)).toEqual(['global-users', PMM_ACCESS_ROLES_PAGE.id]);
    expect(result?.children?.find((c) => c.id === PMM_ACCESS_ROLES_PAGE.id)?.parentItem?.id).toBe(
      GRAFANA_NAV_ID_USERS_AND_ACCESS
    );
  });

  it('does not duplicate Access Roles when already present', () => {
    const existing: NavModelItem = {
      ...PMM_ACCESS_ROLES_PAGE,
      parentItem: usersAndAccessSection,
    };
    const navTree: NavIndex = {
      [GRAFANA_NAV_ID_USERS_AND_ACCESS]: {
        ...usersAndAccessSection,
        children: [{ id: 'global-users', text: 'Users' }, existing],
      },
    };

    const result = buildUsersAndAccessNavWithRoles(navTree);

    expect(result?.children?.filter((c) => c.id === PMM_ACCESS_ROLES_PAGE.id)).toHaveLength(1);
  });
});
