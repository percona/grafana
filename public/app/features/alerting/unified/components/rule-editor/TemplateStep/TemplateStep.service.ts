import { NotificationListResponse } from 'app/percona/integrated-alerting/components/AlertRules/AddAlertRuleModal/AddAlertRuleModal.types';
import { api } from 'app/percona/shared/helpers/api';

export const AddAlertRuleModalService = {
  async notificationList(): Promise<string[]> {
    const {
      alertmanager_config: { receivers },
    } = await api.get<NotificationListResponse, {}>(`/graph/api/alertmanager/grafana/config/api/v1/alerts`);
    return receivers.map((value) => value.name);
  },
};
