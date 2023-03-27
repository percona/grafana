import React, { FC } from 'react';
import { Feedback } from '../../../Feedback';

interface FeedbackContainerProps {
  visible: boolean;
  onFinish?: () => void;
}

export const FeedbackContainer: FC<FeedbackContainerProps> = ({ visible, onFinish }) => {
  return <>{visible && <Feedback onFinish={onFinish} />}</>;
};
