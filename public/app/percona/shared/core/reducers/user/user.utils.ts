import { UserDetailsResponse } from '../../../services/user/User.types';

import { UserDetails } from './user.types';

export const toUserDetailsModel = (res: UserDetailsResponse): UserDetails => ({
  userId: res.user_id,
  snoozedPmmVersion: res.snoozed_pmm_version,
});
