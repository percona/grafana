import { OrgRole } from 'app/types';

export const isPmmAdmin = (user: any): boolean => user.isGrafanaAdmin || user.orgRole === OrgRole.Admin;
