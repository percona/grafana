export const getResourcesWidth = (allocated: number, total: number) => {
  if (total <= 0) {
    return 0;
  }

  return Math.round(((allocated * 100) / total) * 10) / 10;
};
