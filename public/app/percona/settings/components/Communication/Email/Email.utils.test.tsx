import { EmailAuthType } from 'app/percona/settings/Settings.types';
import { isEmailFieldNeeded } from './Email.utils';

describe('Communication::Email::utils', () => {
  describe('isEmailFieldNeeded', () => {
    it('should return true for common fields', () => {
      expect(isEmailFieldNeeded('smarthost', EmailAuthType.NONE)).toBe(true);
      expect(isEmailFieldNeeded('hello', EmailAuthType.LOGIN)).toBe(true);
      expect(isEmailFieldNeeded('from', EmailAuthType.PLAIN)).toBe(true);
    });

    it('should return false for unneeded fields', () => {
      expect(isEmailFieldNeeded('password', EmailAuthType.NONE)).toBe(false);
      expect(isEmailFieldNeeded('identity', EmailAuthType.LOGIN)).toBe(false);
      expect(isEmailFieldNeeded('secret', EmailAuthType.LOGIN)).toBe(false);
    });

    it('should return true for needed fields', () => {
      expect(isEmailFieldNeeded('password', EmailAuthType.LOGIN)).toBe(false);
      expect(isEmailFieldNeeded('password', EmailAuthType.PLAIN)).toBe(false);
      expect(isEmailFieldNeeded('identity', EmailAuthType.PLAIN)).toBe(false);
      expect(isEmailFieldNeeded('secret', EmailAuthType.CRAM)).toBe(false);
    });
  });
});
