import { isTextIncluded, isSameOption } from './filters';

describe('filter utils', () => {
  test('isTextIncluded', () => {
    expect(isTextIncluded('test', 'this is a test')).toBeTruthy();
    expect(isTextIncluded('teste', 'this is a test')).toBeFalsy();
    expect(isTextIncluded('TesT', 'this is a test')).toBeTruthy();
    expect(isTextIncluded('test', 'THIS IS A TEST')).toBeTruthy();
    expect(isTextIncluded('teste', '')).toBeFalsy();
    expect(isTextIncluded('', 'this is a test')).toBeTruthy();
  });

  test('isSameOption', () => {
    expect(isSameOption('foo', 'bar')).toBeFalsy();
    expect(isSameOption('foo', 'foo')).toBeTruthy();
    expect(isSameOption('all', 'bar', 'all')).toBeTruthy();
    expect(isSameOption('foo', 'bar', 'all')).toBeFalsy();
  });
});
