export type VResult = string | undefined;

export type Validator = (value: any, values?: Record<string, any>, meta?: any) => VResult;

export type UnitOptions = {
  ms?: boolean;
  s?: boolean;
  m?: boolean;
};
