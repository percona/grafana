import React, { FC, useState } from 'react';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import FeedbackService from './Feedback.service';

export type FeedbackNote = 'bad' | 'fair' | 'good';

enum Step {
  STEP1,
  STEP2,
  STEP3,
}

interface FeedbackContainerProps {}

const DISPLAY_TIME_FEEDBACK_SENT = 10000;

export const Feedback: FC<FeedbackContainerProps> = () => {
  const [currentStep, setCurrentStep] = useState(Step.STEP1);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');

  const saveFeedback = () => {
    FeedbackService.createFeedback(feedbackNote, feedbackDescription, 'random')
      .catch(() => {})
      .finally(() => {
        setFeedbackDescription('');
        setFeedbackNote('');
        setCurrentStep(Step.STEP1);
      });
  };

  return (
    <>
      {currentStep === Step.STEP1 && (
        <Step1
          onSubmit={(val) => {
            setFeedbackNote(val);
            if (val === 'good') {
              setCurrentStep(Step.STEP3);
            } else {
              setCurrentStep(Step.STEP2);
            }
          }}
        />
      )}
      {currentStep === Step.STEP2 && (
        <Step2
          onSubmit={(description) => {
            setFeedbackDescription(description);
            setCurrentStep(Step.STEP3);
          }}
          onDismiss={() => {
            setFeedbackDescription('');
            setCurrentStep(Step.STEP3);
          }}
        />
      )}
      {currentStep === Step.STEP3 && (
        <Step3 onFinish={() => saveFeedback()} displayTimeMs={DISPLAY_TIME_FEEDBACK_SENT} />
      )}
    </>
  );
};
