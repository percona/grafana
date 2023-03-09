// Recursively converts object keys to camelCase. Useful for payload conversions
// Usage: <CamelCasedPayloadType>payloadToCamelCase(payload)
export const payloadToCamelCase = <T extends object, R extends object>(object: T, ignoredKeys: string[] = []): R => {
  // We use an outer function just to help with typings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recursive = (o: any): any => {
    if (o === Object(o) && !Array.isArray(o) && typeof o !== 'function') {
      const n = {};
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (Object.keys(o) as Array<keyof T>).forEach((key) => {
        const toStrKey = key.toString();

        if (ignoredKeys.includes(toStrKey)) {
          // @ts-ignore
          n[key] = o[key];
        } else {
          const camelCaseKey = toStrKey.replace(/([-_][a-z])/gi, ($1) =>
            $1.toUpperCase().replace('_', '').replace('-', '')
          );

          // @ts-ignore
          n[camelCaseKey] = recursive(o[key]);
        }
      });

      return n;
    } else if (Array.isArray(o)) {
      return o.map((i) => recursive(i));
    }

    return o;
  };

  return recursive(object);
};
