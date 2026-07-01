import { disableCollectors } from './disableCollectors';

describe('disableCollectors validator', () => {
  it('passes for empty or undefined value (optional field)', () => {
    expect(disableCollectors('')).toBeUndefined();
    expect(disableCollectors(undefined)).toBeUndefined();
  });

  it('passes for a single valid token', () => {
    expect(disableCollectors('collector_1')).toBeUndefined();
  });

  it('passes for a comma-delimited list with arbitrary spacing', () => {
    expect(disableCollectors('collector_1, collector2,  collector3')).toBeUndefined();
  });

  it('passes for names containing "." and "-"', () => {
    expect(disableCollectors('custom_query.mr, standard-process')).toBeUndefined();
  });

  it('fails for a token with a space inside the name', () => {
    expect(disableCollectors('bad name')).toEqual(expect.any(String));
  });

  it('fails for a token with an illegal character', () => {
    expect(disableCollectors('collector_1, bad!')).toEqual(expect.any(String));
  });
});
