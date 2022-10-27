import { StepType } from '@reactour/tour';

export interface TourStep extends StepType {
  navMenuId?: string;
  // copied from @react-tour-popover
  // only part of available api, was causing cycling types error otherwise
  position?: 'top' | 'right' | 'bottom' | 'left' | 'center' | [number, number];
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
