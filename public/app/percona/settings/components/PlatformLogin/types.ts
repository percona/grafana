export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  firstName: string;
  lastName: string;
}

export interface SignUpPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface SignUpProps {
  userEmail: string | undefined;
  getSettings: () => void;
}

export interface LoginFormProps {
  getSettings: () => void;
  changeMode: () => void;
}
