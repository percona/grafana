import React from 'react';
import { SectionContentProps } from './SectionContent.types';
import { Messages } from './SectionContent.messages';
import { useStyles2 } from '@grafana/ui';
import { getStyles } from './SectionContent.styles';
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
  const styles = useStyles2(getStyles);
  return (
    <div>
      <p>
        <strong>{Messages.startDate}</strong>: {startDate} <br />
        <strong>{Messages.endDate}</strong>: {endDate} <br />
        <strong>{Messages.summary}</strong>: {summary} <br />
        <strong>{Messages.tier}</strong>: {tier} <br />
        <strong>{Messages.totalUnits}</strong>: {unlimitedUnits ? Messages.unlimited : totalUnits}
        <br />
        <strong>{Messages.softwareFamilies}</strong>: {softwareFamilies?.join(', ')} <br />
        <strong>{Messages.supportLevel}</strong>: {supportLevel} <br />
        <strong>{Messages.platform}</strong>: <br />
        <span className={styles.tab}>{Messages.configAdvisor}</span>: {configAdvisor} <br />
        <span className={styles.tab}>{Messages.securityAdvisor}</span>: {securityAdvisor}
      </p>
    </div>
  );
};
