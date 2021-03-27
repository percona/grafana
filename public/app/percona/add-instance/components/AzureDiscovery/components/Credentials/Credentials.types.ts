export interface AzureCredentialsForm {
  client_id?: string;
  client_secret?: string;
  tenant_id?: string;
  subscription_id?: string;
}

export interface CredentialsProps {
  onSetCredentials: (credentials: AzureCredentialsForm) => void;
  selectInstance: (instance: any) => void;
}
