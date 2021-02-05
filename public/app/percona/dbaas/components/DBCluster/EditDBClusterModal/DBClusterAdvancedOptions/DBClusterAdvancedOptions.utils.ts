export const resourceValidator = (value: number) => {
  const check = (value * 10) % 1;

  return check ? 'Must be an increments of 0.1' : undefined;
};
