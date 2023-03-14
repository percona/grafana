/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/consistent-type-assertions */
import { ReactNode } from 'react';
import { FormRenderProps } from 'react-final-form';

export interface StepProgressProps {
  steps: OneStep[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void;
}

interface OneStep {
  render: (props: FormRenderProps) => ReactNode;
  title?: string;
  fields: string[];
  dataQa?: string;
}
