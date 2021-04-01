import {
  initialValuesStubs,
  operatorsOptionsStubs,
  possibleComponentOptionsStubs,
  psmdbComponentOptionsStubs,
  versionsFieldNameStub,
  versionsStubs,
} from './componentsVersionsStubs';

export const useOperatorsComponentsVersions = () => [
  initialValuesStubs,
  operatorsOptionsStubs,
  psmdbComponentOptionsStubs,
  possibleComponentOptionsStubs,
  versionsStubs,
  versionsFieldNameStub,
  false,
  jest.fn(),
  jest.fn(),
  jest.fn(),
];
