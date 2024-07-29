import { css, cx } from '@emotion/css';
import React, { ComponentProps, FC } from 'react';

import { Page } from 'app/core/components/Page/Page';

type PageContentsProps = ComponentProps<typeof Page.Contents>;

export const TabbedPageContents: FC<PageContentsProps> = ({ children, className, ...props }) => (
  <Page.Contents {...props} className={cx('page-container', 'page-body', styles.Contents, className)}>
    {children}
  </Page.Contents>
);

const styles = {
  Contents: css`
    &.page-container {
      margin-left: 0;
      margin-right: 0;
    }
  `,
};
