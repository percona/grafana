import { Messages } from './AlertRuleParamField.messages';
import { TemplateParamUnit } from '../../AlertRuleTemplate/AlertRuleTemplate.types';

describe('AlertRuleParamField::Messages', () => {
  const { getFloatDescription } = Messages;
  test('getFloatDescription', () => {
    expect(getFloatDescription('threshold', 'a threshold', TemplateParamUnit.SECONDS)).toBe('');
    expect(
      getFloatDescription('threshold', 'a threshold', TemplateParamUnit.SECONDS, {
        has_default: false,
        has_min: true,
        has_max: true,
        min: 10,
        max: 20,
      })
    ).toBe('Threshold - a threshold (seconds, min: 10, max: 20)');
    expect(
      getFloatDescription('just some param', 'a param', TemplateParamUnit.PERCENTAGE, {
        has_default: false,
        has_min: false,
        has_max: true,
        min: 10,
        max: 20,
      })
    ).toBe('Just Some Param - a param (%, max: 20)');
    expect(
      getFloatDescription('threshold', 'a threshold', TemplateParamUnit.SECONDS, {
        has_default: false,
        has_min: true,
        has_max: false,
        min: 10,
        max: 20,
      })
    ).toBe('Threshold - a threshold (seconds, min: 10)');
    expect(
      getFloatDescription('threshold', 'a threshold', TemplateParamUnit.SECONDS, {
        has_default: false,
        has_min: true,
        has_max: true,
        max: 10,
      })
    ).toBe('Threshold - a threshold (seconds, min: 0, max: 10)');
    expect(
      getFloatDescription('threshold', 'a threshold', TemplateParamUnit.PERCENTAGE, {
        has_default: false,
        has_min: false,
        has_max: false,
      })
    ).toBe('Threshold - a threshold (%)');
  });
});
