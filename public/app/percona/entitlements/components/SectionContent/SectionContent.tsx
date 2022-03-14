import React from 'react';
import { SectionContentProps } from './SectionContent.types';

export const SectionContent = ({ entitlement }: SectionContentProps) => {
  const {
    summary,
    tier,
    totalUnits,
    unlimitedUnits,
    supportLevel,
    softwareFamilies,
    startDate,
    endDate,
    platform: { securityAdvisor, configAdvisor },
  } = entitlement;
  return (
    <div>
      <p>Start date: {startDate}</p>
      <p>End date: {endDate}</p>
      <p>Summary: {summary}</p>
      <p>Tier: {tier}</p>
      <p>Total units: {unlimitedUnits ? 'unlimited' : totalUnits}</p>
      <p>Software families: {softwareFamilies?.join(', ')}</p>
      <p>Support level: {supportLevel}</p>
      <p>
        Platform Config Advisor: {configAdvisor}
        Security Advisor: {securityAdvisor}
      </p>
    </div>
  );
};
