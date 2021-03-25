import { apiManagement } from 'app/percona/shared/helpers/api';
import { CredentialsForm } from './components/Credentials/Credentials.types';
import { RDSInstances } from './Discovery.types';

class DiscoveryService {
  static async discoveryAzure({ client_id, client_secret, tenant_id, subscription_id }: CredentialsForm) {
    // return apiManagement.post<RDSInstances, CredentialsForm>('/Azure/Discover', {
    //   client_id,
    //   client_secret,
    //   tenant_id,
    //   subscription_id,
    // });

    return {
      "azure_database_instance": [
      {
        "id": "/subscriptions/41000701-4126-4674-9219-da03b1f9bb58/resourceGroups/askomorokhov-pmm-dev/providers/Microsoft.DBforMySQL/servers/askomorokhov-pmm-dev-mysql-2",
        "location": "eastus",
        "name": "askomorokhov-pmm-dev-mysql-2",
        "administrator_login": "pmm@askomorokhov-pmm-dev-mysql-2",
        "fully_qualified_domain_name": "askomorokhov-pmm-dev-mysql-2.mysql.database.azure.com",
        "resource_group": "askomorokhov-pmm-dev",
        "type": "DISCOVER_AZURE_DATABASE_TYPE_MYSQL"
      },
      {
        "id": "/subscriptions/41000701-4126-4674-9219-da03b1f9bb58/resourceGroups/pmmdemo/providers/Microsoft.DBforPostgreSQL/servers/pgadivinho",
        "location": "eastus",
        "name": "pgadivinho",
        "administrator_login": "adivinho@pgadivinho",
        "fully_qualified_domain_name": "pgadivinho.postgres.database.azure.com",
        "resource_group": "pmmdemo",
        "type": "DISCOVER_AZURE_DATABASE_TYPE_POSTGRESQL"
      },
      {
        "id": "/subscriptions/41000701-4126-4674-9219-da03b1f9bb58/resourceGroups/pmmdemo/providers/Microsoft.DBforMySQL/servers/pmmdemo-azuredb",
        "location": "eastus",
        "name": "pmmdemo-azuredb",
        "administrator_login": "pmmdemoazure@pmmdemo-azuredb",
        "fully_qualified_domain_name": "pmmdemo-azuredb.mysql.database.azure.com",
        "resource_group": "pmmdemo",
        "environment": "production",
        "type": "DISCOVER_AZURE_DATABASE_TYPE_MYSQL"
      }
    ]
    }
  }
}

export default DiscoveryService;
