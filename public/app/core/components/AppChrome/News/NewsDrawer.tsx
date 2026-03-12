import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { t } from '@grafana/i18n';
import { Drawer, useStyles2, Text } from '@grafana/ui';

import { NewsWrapper } from './NewsWrapper';

interface NewsContainerProps {
  className?: string;
  onClose: () => void;
}

export function NewsContainer({ onClose }: NewsContainerProps) {
  const styles = useStyles2(getStyles);

  return (
    <Drawer
      title={
        <div className={styles.title}>
          <Text element="h2">{t('news.title', 'Latest from the blog')}</Text>
          {/* @PERCONA - point to percona blog */}
          <a
            href="https://www.percona.com/blog/"
            target="_blank"
            rel="noreferrer"
            title={t('news.go-to-percona-blog', 'Go to Percona blog')}
            className={styles.grot}
          >
            <img src="public/img/percona-logo.svg" alt="Percona logo" />
          </a>
        </div>
      }
      onClose={onClose}
      size="md"
    >
      {/* @PERCONA */}
      <NewsWrapper feedUrl="/percona-blog/feed" />
    </Drawer>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    title: css({
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      gap: theme.spacing(2),
    }),
    grot: css({
      display: `flex`,
      alignItems: `center`,
      justifyContent: `center`,
      padding: theme.spacing(2, 0),

      img: {
        width: `75px`,
        height: `75px`,
      },
    }),
  };
};
