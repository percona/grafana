import { Advisor, CategorizedAdvisor } from './Advisors.types';

export const groupAdvisorsIntoCategories = (advisors: Advisor[]): CategorizedAdvisor => {
  const result: CategorizedAdvisor = {};

  advisors.forEach((advisor) => {
    const { category, summary, checks } = advisor;

    const modifiedChecks = checks.map((check) => ({
      ...check,
      disabled: check.disabled ? true : false,
    }));

    if (!result[category]) {
      result[category] = {};
    }

    if (!result[category][summary]) {
      result[category][summary] = { ...advisor, checks: [...modifiedChecks] };
    }
  });
  return result;
};