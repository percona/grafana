import React, { FC, useState } from 'react';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { PortalAPI } from 'api';

export enum FeedbackNote {
  BAD,
  FAIR,
  GOOD,
}

enum Step {
  STEP1,
  STEP2,
  STEP3,
}

interface FeedbackContainerProps {
  pmmServerId?: string;
  onFinish?: () => void;
}

const DISPLAY_TIME_FEEDBACK_SENT = 10000;

export const Feedback: FC<FeedbackContainerProps> = ({ pmmServerId, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(Step.STEP1);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');

  const saveFeedback = () => {
    PortalAPI.createFeedback(feedbackNote, feedbackDescription, pmmServerId || '')
      .catch(() => {})
      .finally(() => {
        if (onFinish) {
          onFinish();
        }

        setFeedbackDescription('');
        setFeedbackNote('');
      });
  };

  return (
    <>
      {currentStep === Step.STEP1 && (
        <Step1
          onSubmit={(val) => {
            setFeedbackNote(FeedbackNote[val]);
            if (val === FeedbackNote.GOOD) {
              saveFeedback();
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
            saveFeedback();
            setCurrentStep(Step.STEP3);
          }}
          onDismiss={() => {
            setCurrentStep(Step.STEP3);
          }}
        />
      )}
      {currentStep === Step.STEP3 && (
        <Step3 onFinish={() => setCurrentStep(Step.STEP1)} displayTimeMs={DISPLAY_TIME_FEEDBACK_SENT} />
      )}
    </>
  );
};
