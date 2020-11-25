import { getBackendSrv } from '@grafana/runtime';
import { TemplatesList, UploadAlertRuleTemplatePayload } from './AlertRuleTemplate.types';

const BASE_URL = `${window.location.origin}/v1/management/ia/Templates`;

export const AlertRuleTemplateService = {
  async upload(payload: UploadAlertRuleTemplatePayload) {
    return getBackendSrv().post(`${BASE_URL}/Create`, payload);
  },
  async list(): Promise<TemplatesList> {
    return getBackendSrv().post(`${BASE_URL}/List`);
  },
};
