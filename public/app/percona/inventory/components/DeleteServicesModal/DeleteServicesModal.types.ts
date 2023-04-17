import { Row } from 'react-table';

import { Service } from 'app/percona/shared/services/services/Services.types';

export interface DeleteServicesModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  onSuccess: () => void;
  services: Array<Row<Service>>;
}
