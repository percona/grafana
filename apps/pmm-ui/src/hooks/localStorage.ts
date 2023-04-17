import { useState, useEffect } from 'react';

function getStorageValue(key: any, defaultValue: any) {
  // getting stored value
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

export const useLocalStorage = (key: any, defaultValue: any) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
