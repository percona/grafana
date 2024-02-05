// there is a problem with exported types from react tour
// @ts-ignore
import { BtnFnProps } from '@reactour/tour/dist/types';
import React, { FC } from 'react';

import { Button, IconButton } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import usePerconaTour from 'app/percona/shared/core/hooks/tour';

const NextButton: FC<BtnFnProps> = () => {
  const { tour, endTour, nextStep, isLastStep } = usePerconaTour();
  const { chrome } = useGrafana();

  const handleClick = () => {
    if (tour === 'product') {
      chrome.setMegaMenu('closed');
      chrome.setMegaMenu('open');
    }
    nextStep();
  }

  return isLastStep ? (
    <Button onClick={() => tour && endTour(tour)}>Done</Button>
  ) : (
    <IconButton aria-label="Next step" onClick={handleClick} name="arrow-right" size="lg" />
  );
};

export default NextButton;
