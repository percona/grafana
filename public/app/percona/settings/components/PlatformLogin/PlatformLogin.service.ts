import { api } from 'app/percona/shared/helpers/api';
import { LoginCredentials, SignUpCredentials, SignUpPayload } from './types';

export const PlatformLoginService = {
  signUp({ firstName, lastName, email }: SignUpCredentials): Promise<void> {
    return api.post<void, SignUpPayload>('/v1/Platform/SignUp', {
      password: '',
      first_name: firstName,
      last_name: lastName,
      email,
    });
  },
  signIn(credentials: LoginCredentials): Promise<void> {
    return api.post<void, LoginCredentials>('/v1/Platform/SignIn', credentials);
  },
  signOut(): Promise<void> {
    return api.post<void, {}>('/v1/Platform/SignOut', {});
  },
};
