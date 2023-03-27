import React, { FC } from 'react';
import { Tip } from '../Tip';
import { IconName } from '@grafana/ui';
import { useDispatch } from 'react-redux';
import { TipModel } from '../../../../reducers/tips/tips';

export interface TipsContainerProps {
  className?: string;
  userId: number;
  tips: TipModel[];
  currentlySelectedTipId: number;
  setTipSelected: any;
}

export const TipsContainer: FC<TipsContainerProps> = (props) => {
  const { className, tips, currentlySelectedTipId, setTipSelected } = props;
  const dispatch = useDispatch();

  return <div className={className}>
      {tips.map((t, i) => (
        <Tip
          title={t.title}
          number={i + 1}
          buttonText={t.buttonText}
          buttonIcon={t.buttonIcon as IconName}
          buttonTooltipText={t.buttonTooltipText}
          buttonUrl={t.url}
          tipText={t.text}
          onClick={!t.completed ? () => dispatch(setTipSelected(t.id)) : () => {}}
          completed={t.completed}
          opened={currentlySelectedTipId === t.id}
        />
      ))}
    </div>
};
