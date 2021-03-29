import { apiManagement } from 'app/percona/shared/helpers/api';
import { AzureCredentialsForm } from './components/Credentials/Credentials.types';
import { AzureDatabaseInstances } from './Discovery.types';

class DiscoveryService {
  static async discoveryAzure({ client_id, client_secret, tenant_id, subscription_id }: AzureCredentialsForm) {
    return apiManagement.post<AzureDatabaseInstances, AzureCredentialsForm>('/AzureDatabase/Discover', {
      client_id,
      client_secret,
      tenant_id,
      subscription_id,
    });
  }
}

export default DiscoveryService;
