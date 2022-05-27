import React, { FC } from 'react';
import { components } from '@reactour/tour';
import { ContentProps } from '@reactour/tour/dist/components/Content';

const Close: FC<ContentProps> = ({ content, children, setCurrentStep, currentStep }) => (
  <components.Content content={content} setCurrentStep={setCurrentStep} currentStep={currentStep}>
    {children}
  </components.Content>
);

export default Close;
