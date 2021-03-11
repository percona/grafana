import { TemplateFloatParam, TemplateParamUnit } from '../../AlertRuleTemplate/AlertRuleTemplate.types';
import { beautifyUnit } from '../../AlertRuleTemplate/AlertRuleTemplate.utils';

export const Messages = {
  getFloatDescription: (name: string, summary: string, unit: TemplateParamUnit, float?: TemplateFloatParam) => {
    if (!float) {
      return '';
    }

    const lowerCaseNameSentenceArr = name.toLowerCase().split(' ');
    const capitalizedSentence = lowerCaseNameSentenceArr
      .map(word => `${word[0].toUpperCase()}${word.slice(1)}`)
      .join(' ');
    const { has_min, has_max, min = 0, max = 0 } = float;
    const paramDetails: string[] = [beautifyUnit(unit)];

    if (has_min) {
      paramDetails.push(`min: ${min}`);
    }

    if (has_max) {
      paramDetails.push(`max: ${max}`);
    }

    return `${capitalizedSentence} - ${summary} (${paramDetails.join(', ')})`;
  },
};
