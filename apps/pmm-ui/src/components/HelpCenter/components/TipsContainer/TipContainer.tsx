import React, { FC, useState } from 'react';
import tipsData from './data/tips.json';
import { Tip } from '../Tip';
import { IconName } from '@grafana/ui';

export interface TipContainerProps {
  className?: string;
}

export const TipContainer: FC<TipContainerProps> = ({ className }) => {
  const notCompletedTip = tipsData.find((tipData) => tipData.completed === false);
  const initial = notCompletedTip !== undefined ? notCompletedTip.id : 0;
  const [tip, setTip] = useState(initial);

  return (
    <div className={className}>
      {tipsData.map((t) => (
        <Tip
          title={t.title}
          number={t.id}
          buttonText={t.buttonText}
          buttonIcon={t.buttonIcon as IconName}
          buttonTooltipText={t.buttonTooltipText}
          tipText={t.text}
          onClick={!t.completed ? () => setTip(t.id) : () => {}}
          completed={t.completed}
          opened={tip === t.id}
        />
      ))}
    </div>
  );
};
