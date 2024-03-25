import { apiManagement } from '../../helpers/api';

import { ActionRequest, ActionResponse } from './Actions.types';

export const ActionsService = {
  getActionResult<T>(body: ActionRequest) {
    return apiManagement.get<ActionResponse<T>, ActionRequest>(`/actions/${body.action_id}`);
  },
};
