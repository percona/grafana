import React, { FC } from 'react';
import { Icon, IconName, useStyles2 } from '@grafana/ui';
import { Resource } from '../Resource';
import resourcesData from './stub/resources.json';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { Messages } from './ResourcesContainer.messages';

interface ResourcesContainerProps {
  openKeyboardShortcut: () => void;
}

export const ResourcesContainer: FC<ResourcesContainerProps> = (props) => {
  const styles = useStyles2(getStyles);
  const { openKeyboardShortcut } = props;

  return (
    <div className={styles.resourceContainer}>
      <div>
        {resourcesData.map((r) => (
          <Resource
            key={r.id}
            icon={r.icon as IconName}
            title={r.title}
            text={r.text}
            buttonText={r.buttonText}
            url={r.url}
          />
        ))}
      </div>
      <div className={styles.shortcutContainer}>
        <div className={styles.border}>
          <div className={styles.shortcutHeader}>
            <a href="#" onClick={openKeyboardShortcut}>
              {Messages.shortcut1}
            </a>
          </div>
          <div className={styles.link}>
            <Icon name="download-alt" size="lg" />
            <a className={styles.title} target="_blank" href="/logs.zip">
              {Messages.shortcut2}
            </a>
          </div>
          <div className={styles.link}>
            <Icon name="comments-alt" size="lg" />
            <a
              className={styles.title}
              target="_blank"
              href="https://www.percona.com/services/support?utm_source=pmm_footer"
            >
              {Messages.shortcut3}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  resourceContainer: css`
    margin-top: ${theme.spacing(3)};
  `,
  shortcutContainer: css`
    margin-bottom: ${theme.spacing(2)};
    margin-top: ${theme.spacing(3)};

    padding-bottom: ${theme.spacing(2)};
  `,
  border: css`
    border-top: 1px solid ${theme.colors.background.secondary};
    padding-top: ${theme.spacing(3)};
  `,
  shortcutHeader: css`
    padding-left: ${theme.spacing(2)};
    padding-bottom: ${theme.spacing(3)};

    font-size: 14px;
    line-height: 16px;
    display: flex;
    align-items: center;
    text-align: center;
  `,
  link: css`
    padding: 0 0 ${theme.spacing(3)} ${theme.spacing(2)};
    display: flex;
    gap: ${theme.spacing(1)};
    font-weight: 500;
    font-size: 14px;
    line-height: 16px;
  `,
  title: css``,
});
