import { ApiResource } from './api';

const onboarding = new ApiResource({ baseURL: '/v1/onboarding' });

export interface ApiTipModel {
  tipId: number;
  isCompleted: boolean;
}

export interface OnboardingResponse {
  systemTips: ApiTipModel[];
  userTips: ApiTipModel[];
}

export const OnboardingAPI = {
  getOnboardingState: async () => await onboarding.get<OnboardingResponse, any>(``),
  completeTip: async (tipId: number) =>
    await onboarding.post<any, any>('/tips/complete', {
      tipId,
    }),
};
