import { durationToMs, isValidProtobufDuration } from './duration';

describe('isValidProtobufDuration', () => {
  it('should accept integer seconds', () => {
    expect(isValidProtobufDuration('1s')).toBe(true);
    expect(isValidProtobufDuration('60s')).toBe(true);
    expect(isValidProtobufDuration('0s')).toBe(true);
  });

  it('should accept fractional seconds', () => {
    expect(isValidProtobufDuration('1.5s')).toBe(true);
    expect(isValidProtobufDuration('0.001s')).toBe(true);
  });

  it('should accept negative durations', () => {
    expect(isValidProtobufDuration('-1s')).toBe(true);
    expect(isValidProtobufDuration('-1.5s')).toBe(true);
  });

  it('should accept millisecond notation', () => {
    expect(isValidProtobufDuration('500ms')).toBe(true);
    expect(isValidProtobufDuration('1ms')).toBe(true);
    expect(isValidProtobufDuration('0ms')).toBe(true);
    expect(isValidProtobufDuration('1.5ms')).toBe(true);
  });

  it('should trim whitespace', () => {
    expect(isValidProtobufDuration('  1s  ')).toBe(true);
    expect(isValidProtobufDuration('  500ms  ')).toBe(true);
  });

  it('should reject bare numbers', () => {
    expect(isValidProtobufDuration('1')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidProtobufDuration('')).toBe(false);
  });

  it('should accept minute notation', () => {
    expect(isValidProtobufDuration('1m')).toBe(true);
    expect(isValidProtobufDuration('0m')).toBe(true);
    expect(isValidProtobufDuration('60m')).toBe(true);
    expect(isValidProtobufDuration('0.5m')).toBe(true);
    expect(isValidProtobufDuration('-1m')).toBe(true);
  });

  it('should reject other units', () => {
    expect(isValidProtobufDuration('1h')).toBe(false);
  });
});

describe('durationToMs', () => {
  it('should convert seconds to milliseconds', () => {
    expect(durationToMs('1s')).toBe(1000);
    expect(durationToMs('2s')).toBe(2000);
    expect(durationToMs('0s')).toBe(0);
  });

  it('should convert fractional seconds to milliseconds', () => {
    expect(durationToMs('1.5s')).toBe(1500);
    expect(durationToMs('0.5s')).toBe(500);
  });

  it('should convert milliseconds', () => {
    expect(durationToMs('500ms')).toBe(500);
    expect(durationToMs('1ms')).toBe(1);
    expect(durationToMs('0ms')).toBe(0);
  });

  it('should convert fractional milliseconds', () => {
    expect(durationToMs('1.5ms')).toBe(1.5);
  });

  it('should trim whitespace', () => {
    expect(durationToMs('  1s  ')).toBe(1000);
    expect(durationToMs('  500ms  ')).toBe(500);
  });

  it('should convert minutes to milliseconds', () => {
    expect(durationToMs('1m')).toBe(60000);
    expect(durationToMs('2m')).toBe(120000);
    expect(durationToMs('0m')).toBe(0);
  });

  it('should convert fractional minutes to milliseconds', () => {
    expect(durationToMs('0.5m')).toBe(30000);
    expect(durationToMs('1.5m')).toBe(90000);
  });

  it('should trim whitespace for minutes', () => {
    expect(durationToMs('  1m  ')).toBe(60000);
  });

  it('should throw on invalid input', () => {
    expect(() => durationToMs('1h')).toThrow('Invalid duration: "1h"');
    expect(() => durationToMs('1')).toThrow('Invalid duration: "1"');
    expect(() => durationToMs('')).toThrow();
  });
});
