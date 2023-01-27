import React, { ReactNode, useEffect, useState } from 'react';

import { Alert } from '@grafana/ui';

interface AlertLocalStorageProps {
  uniqueName: string;
  title: string;
  customButtonContent: ReactNode;
  onCustomButtonClick: () => void;
  children: ReactNode;
}

export const AlertLocalStorage = ({
  uniqueName,
  title,
  children,
  customButtonContent,
  onCustomButtonClick,
}: AlertLocalStorageProps) => {
  const [showAlert, setShowAlert] = useState(true);

  const setToLocalStorage = (keyName: string, keyValue: boolean, ttlInDays: number) => {
    const data = {
      value: keyValue,
      ttl: Date.now() + ttlInDays * 1000 * 60 * 60 * 24,
    };

    localStorage.setItem(keyName, JSON.stringify(data));
  };

  const getFromLocalStorage = (keyName: string) => {
    const data = localStorage.getItem(keyName);
    if (!data) {
      return null;
    }

    const item = JSON.parse(data);

    if (Date.now() > item.ttl) {
      localStorage.removeItem(keyName);
      return null;
    }

    return item.value;
  };

  useEffect(() => {
    const isClosed = getFromLocalStorage(uniqueName);
    if (isClosed) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
    }
  }, [uniqueName]);

  const handleCloseAlert = () => {
    setToLocalStorage(uniqueName, true, 7);
    setShowAlert(false);
  };

  return (
    <div>
      {showAlert && (
        <Alert
          title={title}
          severity="info"
          customButtonContent={customButtonContent}
          onCustomButtonClick={onCustomButtonClick}
          onRemove={handleCloseAlert}
        >
          {children}
        </Alert>
      )}
    </div>
  );
};
