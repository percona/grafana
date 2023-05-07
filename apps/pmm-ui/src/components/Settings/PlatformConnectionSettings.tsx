import React, { FC } from 'react';
import { GrafanaTheme2 } from '@grafana/data';

import { css } from '@emotion/css';
import { Badge, Button, Field, FieldSet, HorizontalGroup, Input, useStyles2 } from '@grafana/ui';
import liIcon from './assets/list-item-icon.svg';
import { Messages } from './PlatformConnectionSettings.messages';

export interface PlatformConnectionSettingsProps {
  connected?: boolean;
  pmmServerId?: string;
}

export const PlatformConnectionSettings: FC<PlatformConnectionSettingsProps> = ({ connected, pmmServerId }) => {
  const styles = useStyles2(getStyles);

  const connectedContent = (
    <>
      <p>
        {Messages.connected.section1.main}
        <ul className={styles.unorderedList}>
          <li className={styles.liStyle}>{Messages.connected.section1.subsection1}</li>
          <li className={styles.liStyle}>{Messages.connected.section1.subsection2}</li>
        </ul>
      </p>
      <p>

      </p>
      <Button variant="secondary" className={styles.button}>
        {Messages.button.disconnectPlatform}
      </Button>
      <Button variant="primary" icon="external-link-alt" onClick={() => window.open('https://portal.percona.com')}>
        {Messages.button.openPerconaPlatform}
      </Button>
    </>
  );

  const disconnectedContent = (
    <>
      <p>
        {Messages.disconnected.section1.main}
        <ul className={styles.unorderedListDisconnected}>
          <li>{Messages.disconnected.section1.subsection1}</li>
          <li>{Messages.disconnected.section1.subsection2}</li>
          <li>{Messages.disconnected.section1.subsection3}</li>
          <li>{Messages.disconnected.section1.subsection4}</li>
        </ul>
      </p>
      <Button>{Messages.button.connectToPlatform}</Button>
    </>
  );

  return (
    <>
      <h2 className={styles.title}>{Messages.title}</h2>
      <FieldSet className={styles.fieldset}>
        <HorizontalGroup>
          <Field label={Messages.formLabel.serverName}>
            <Input name="serverName" className={styles.input} />
          </Field>
          <Field label={Messages.formLabel.serverId}>
            <Input name="serverId" className={styles.input} disabled value={pmmServerId} />
          </Field>
        </HorizontalGroup>
      </FieldSet>
      <Button variant="secondary">{Messages.button.save}</Button>

      <div className={styles.separator} />

      <h2 className={styles.title}>
        {Messages.connectionStatusTitle}
        {connected ? (
          <Badge text={Messages.badge.connected} color="green" icon="check-circle" className={styles.badge} />
        ) : (
          <Badge text={Messages.badge.disconnected} color="red" icon="minus-circle" className={styles.badge} />
        )}
      </h2>
      {connected ? { ...connectedContent } : { ...disconnectedContent }}
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  title: css`
    margin-bottom: ${theme.spacing(4)};
  `,
  fieldset: css`
    margin: ${theme.spacing(3, 0, 1)};
  `,
  separator: css`
    width: auto;
    height: 1px;
    background: rgba(204, 204, 220, 0.15);

    margin: ${theme.spacing(4, 0)};
  `,
  input: css`
    width: 340px;
  `,
  badge: css`
    /** moving badge up a bit **/
    position: relative;
    top: -4px;
    margin-left: ${theme.spacing(1)};
  `,
  link: css`
    color: ${theme.colors.text.link};
  `,
  unorderedList: css`
    padding: ${theme.spacing(4, 5, 0)};
  `,

  unorderedListDisconnected: css`
    padding: ${theme.spacing(1, 2, 0)};
  `,

  liStyle: css`
    padding-left: ${theme.spacing(2)};
    padding-bottom: ${theme.spacing(4)};

    position: relative;
    list-style-type: none;
    &:before {
      content: '';
      position: absolute;
      top: -2px;
      left: -25px;
      width: 28px;
      height: 28px;
      background-image: url(${liIcon});
    }
  `,
  button: css`
    margin-right: ${theme.spacing(2)};
  `,
});
