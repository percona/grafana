const DURATION_RE = /^-?\d+(?:\.\d+)?(ms|s|m)$/;

export const isValidProtobufDuration = (durationString: string): boolean => DURATION_RE.test(durationString.trim());

export const durationToMs = (duration: string): number => {
  const trimmed = duration.trim();

  if (trimmed.endsWith('ms')) {
    return parseFloat(trimmed.slice(0, -2));
  }

  if (trimmed.endsWith('m')) {
    return parseFloat(trimmed.slice(0, -1)) * 60 * 1000;
  }

  if (trimmed.endsWith('s')) {
    return parseFloat(trimmed.slice(0, -1)) * 1000;
  }

  throw new Error(`Invalid duration: "${duration}"`);
};

export const getDurationUnit = (value: string): string | undefined => {
  const match = value.trim().match(DURATION_RE);
  return match?.[1];
};
