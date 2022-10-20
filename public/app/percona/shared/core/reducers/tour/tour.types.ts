import { StepType } from '@reactour/tour';

export interface TourStep extends StepType {
  navMenuId?: string;
}

export enum TourType {
  Product = 'product',
  Alerting = 'alerting',
}

export interface TourState {
  isOpen: boolean;
  tour?: TourType;
  steps: Record<TourType, TourStep[]>;
}

export interface SetStepsActionPayload {
  tour: TourType;
  steps: TourStep[];
}
