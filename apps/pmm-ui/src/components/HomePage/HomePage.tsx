import React, { FC } from 'react';
import { Button, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { ActionCard } from './comonents/ActionCard';
import imgDbHealth from './assets/db-health.svg';
import imgDiscoverPatterns from './assets/discover-patterns.svg';
import imgOptmizeAndImprove from './assets/optimize-and-improve.svg';
import imgMaintainPerformance from './assets/maintain-performance.svg';
import { ActionContainer } from './comonents/ActionContainer';
import { HelpCenterContainer } from './comonents/HelpCenterContainer';

interface HomePageProps {
  onHelpCenterLinkClick?: () => void;
  onGettingStartedGuideLinkClicked?: () => void;
}

export const HomePage: FC<HomePageProps> = ({ onHelpCenterLinkClick, onGettingStartedGuideLinkClicked }) => {
  const styles = useStyles2(getStyles);

  const wavingHandEmoji = String.fromCodePoint(128075);
  const ringBuoyEmoji = String.fromCodePoint(128735);
  const welcomeHeader = `${wavingHandEmoji} Welcome to PMM`;
  const welcomeText =
    "We're glad to have you onboard in Percona Monitoring and Management (PMM). Get ready to monitor and optimize your database like a pro with our powerful and more user-friendly tool. Let's get started!";
  const helpBlockHeader = `${ringBuoyEmoji} We’re here to help`;
  const helpBlockText =
    "We've got you covered. Check out our Help Center, official documentation, and community forums to find the answers you need and connect with other PMM users.";
  return (
    <div className={styles.welcomePage}>
      <div className={styles.welcomePageContent}>
        <ActionContainer headerType="h1" header={welcomeHeader} text={welcomeText} actionsSpacing="none">
          <ActionCard text="Monitor database health" imgSrc={imgDbHealth} imgAlt="Monitor database health" />
          <ActionCard text="Discover patterns" imgSrc={imgDiscoverPatterns} imgAlt="Discover patterns" />
          <ActionCard text="Optimize and improve" imgSrc={imgOptmizeAndImprove} imgAlt="Optimize and improve" />
          <ActionCard text="Maintain performance" imgSrc={imgMaintainPerformance} imgAlt="Maintain performance" />
        </ActionContainer>
        <HelpCenterContainer />
        <ActionContainer headerType="h2" header={helpBlockHeader} text={helpBlockText} actionsSpacing="md">
          <Button variant="secondary">Open Help Center</Button>
          <Button variant="secondary" icon="external-link-alt">
            PMM Documentation
          </Button>
          <Button variant="secondary" icon="external-link-alt">
            Community Forum
          </Button>
        </ActionContainer>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  welcomePage: css`
    background: ${theme.colors.background.canvas};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    padding: 16px;
    gap: 10px;
  `,
  welcomePageContent: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 0;
    gap: 32px;

    width: 640px;
    height: 795px;
  `,
});
