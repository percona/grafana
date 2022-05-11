import { api } from 'app/percona/shared/helpers/api';
import { NotificationListResponse } from './AddAlertRuleModal.types';

export const AddAlertRuleModalService = {
  async notificationList(): Promise<string[]> {
    const {
      alertmanager_config: { receivers },
    } = await api.get<NotificationListResponse, {}>(`/graph/api/alertmanager/grafana/config/api/v1/alerts`);
    return receivers.map((value) => value.name);
  },
};
