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
  utmMedium?: string;
}

const replaceUtmMedium = (url: string, utmMedium: string): string => {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.searchParams.has('utm_medium')) {
      parsedUrl.searchParams.set('utm_medium', utmMedium);
    }

    return parsedUrl.toString();
  } catch {
    return url;
  }
};

export const TipsContainer: FC<TipsContainerProps> = (props) => {
  const { className, userId, tips, currentlySelectedTipId, setTipSelected, utmMedium } = props;
  const dispatch = useDispatch();

  return (
    <div className={className}>
      {tips.map((t, i) => (
        <Tip
          title={t.title}
          number={i + 1}
          buttonText={t.buttonText}
          buttonIcon={t.buttonIcon as IconName}
          buttonTooltipText={t.buttonTooltipText}
          buttonUrl={utmMedium ? replaceUtmMedium(t.url, utmMedium) : t.url}
          tipText={t.text}
          onClick={!t.completed ? () => dispatch(setTipSelected(t.id)) : () => {}}
          completed={t.completed}
          opened={currentlySelectedTipId === t.id}
          canUserComplete={t.canUserComplete}
          userId={userId}
          tipId={t.id}
        />
      ))}
    </div>
  );
};
