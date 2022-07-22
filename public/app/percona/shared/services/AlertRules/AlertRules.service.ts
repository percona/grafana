import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { AlertRuleCreatePayload } from './AlertRules.types';

const BASE_URL = `/v1/management/ia/Rules`;

export const AlertRulesService = {
  async create(payload: AlertRuleCreatePayload, token?: CancelToken): Promise<void> {
    return api.post(`${BASE_URL}/Create`, payload, false, token);
  },
};
