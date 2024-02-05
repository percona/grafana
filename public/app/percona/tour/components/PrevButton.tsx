// there is a problem with exported types from react tour
// @ts-ignore
import { BtnFnProps } from '@reactour/tour/dist/types';
import React, { FC } from 'react';

import { IconButton } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import usePerconaTour from 'app/percona/shared/core/hooks/tour';

const PrevButton: FC<BtnFnProps> = () => {
  const { tour, previousStep, isFirstStep } = usePerconaTour();

  const { chrome } = useGrafana();

  const handleClick = async () => {
    if (tour === 'product') {
      await chrome.setMegaMenu('closed');
      await chrome.setMegaMenu('open');
    }
    previousStep();
  };

  return (
    <IconButton onClick={handleClick} aria-label="Previous step" name="arrow-left" size="lg" disabled={isFirstStep} />
  );
};

export default PrevButton;
