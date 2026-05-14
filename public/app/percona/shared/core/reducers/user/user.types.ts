export interface UserDetails {
  userId: number;
  snoozedPmmVersion?: string;
}

export interface PerconaUserState extends UserDetails {
  isAuthorized: boolean;
}
