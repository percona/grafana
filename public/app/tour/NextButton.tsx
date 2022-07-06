import React, { FC } from 'react';
import { Button, IconButton } from '@grafana/ui';
import { BtnFnProps } from '@reactour/tour/dist/types';
import { useLocalStorage } from 'react-use';
import { PERCONA_TOUR_FLAG } from './constants';

const NextButton: FC<BtnFnProps> = ({ currentStep, setCurrentStep, stepsLength, setIsOpen }) => {
  const lastStep = currentStep === stepsLength - 1;
  const [, setShowTour] = useLocalStorage<boolean>(PERCONA_TOUR_FLAG, true);

  const onDone = () => {
    setIsOpen(false);
    setShowTour(false);
  };

  const onNext = () => setCurrentStep((step) => (step === stepsLength - 1 ? step : step + 1));

  return lastStep ? (
    <Button onClick={onDone} data-testid="pmm-tour-done">Done</Button>
  ) : (
    <IconButton onClick={onNext} name="arrow-right" size="lg" data-testid="pmm-tour-next-step" />
  );
};

export default NextButton;
