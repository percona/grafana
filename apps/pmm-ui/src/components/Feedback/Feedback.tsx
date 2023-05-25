import React, { FC, useState } from 'react';
import { Step1 } from './steps/Step1';
import { Step2 } from './steps/Step2';
import { Step3 } from './steps/Step3';
import { PortalAPI } from 'api';

export enum Rating {
  BAD = 1,
  FAIR = 5,
  GOOD = 10,
}

export enum Step {
  STEP1 = 0,
  STEP2 = 1,
  STEP3 = 2,
}

interface FeedbackContainerProps {
  pmmServerId?: string;
  onFinish?: () => void;
  step?: Step;
  delayOnLastStep?: boolean;
}

const DISPLAY_TIME_FEEDBACK_SENT = 10000;

export const Feedback: FC<FeedbackContainerProps> = ({ step, pmmServerId, onFinish, delayOnLastStep}) => {
  const [currentStep, setCurrentStep] = useState(step || Step.STEP1);
  const [rating, setRating] = useState<Rating | null>();

  const saveFeedback = (rating: Rating, description: string) => {
    if (!rating) {
      console.error(`[rating] ${rating} must be defined`);
      return;
    }
    PortalAPI.createFeedback(rating, description, pmmServerId || '')
      .catch(() => {})
      .finally(() => {
        setRating(null);
      });
  };

  return (
    <>
      {currentStep === Step.STEP1 && (
        <Step1
          onSubmit={(rating) => {
            setRating(rating);

            if (rating === Rating.GOOD) {
              saveFeedback(rating, '');
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
            saveFeedback(rating!, description);
            setCurrentStep(Step.STEP3);
          }}
          onDismiss={() => {
            setCurrentStep(Step.STEP3);
          }}
        />
      )}
      {currentStep === Step.STEP3 && (
        <Step3
          onFinish={() => {
            setCurrentStep(Step.STEP1);
            if (onFinish) {
              onFinish();
            }}
          }
          displayTimeMs={delayOnLastStep ? DISPLAY_TIME_FEEDBACK_SENT : 0}
        />
      )}
    </>
  );
};
