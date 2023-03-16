import React, { FC, useEffect } from 'react';
import { Tip } from '../Tip';
import { IconName, Spinner } from '@grafana/ui';
import { useDispatch, useSelector } from 'react-redux';
import { StoreState } from '../../../../reducers/store';
import { fetchTipsAction, setCurrentlySelected } from '../../../../reducers/tips/tips';

export interface TipsContainerProps {
  className?: string;
}

export const TipsContainer: FC<TipsContainerProps> = ({ className }) => {
  const { loading, tips, currentlySelected } = useSelector((state: StoreState) => state.tips);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTipsAction({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <div>
      <Spinner size={30} />
    </div>
  ) : (
    <div className={className}>
      {tips.map((t) => (
        <Tip
          title={t.title}
          number={t.id}
          buttonText={t.buttonText}
          buttonIcon={t.buttonIcon as IconName}
          buttonTooltipText={t.buttonTooltipText}
          tipText={t.text}
          onClick={!t.completed ? () => dispatch(setCurrentlySelected(t.id)) : () => {}}
          completed={t.completed}
          opened={currentlySelected === t.id}
        />
      ))}
    </div>
  );
};
