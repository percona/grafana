import React, { FC, useEffect } from 'react';
import { Tip } from '../Tip';
import { IconName, Spinner } from '@grafana/ui';import { useDispatch, useSelector } from 'react-redux';
import { AllTipsState, setSystemTipsCurrentlySelected, TipModel } from '../../../../reducers/tips/tips';

export interface TipsContainerProps {
  className?: string;
  userId: number;
  loading: boolean;
  tips: TipModel[];
  currentlySelectedTipId: number;
  setTipSelected: any;
}

export const TipsContainer: FC<TipsContainerProps> = (props) => {
  const { className, tips, currentlySelectedTipId, setTipSelected } = props;
  const dispatch = useDispatch();

  console.log("currentlySelectedTipId", currentlySelectedTipId);
  console.log("tips", tips);
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
