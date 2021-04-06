import React, { FC } from 'react';
import { useStyles } from '@grafana/ui';
import { useSelector } from 'react-redux';
import { StoreState } from 'app/types';
import { Breadcrumb } from 'app/core/components/Breadcrumb';
import { getStyles } from './PageWrapper.styles';
import { PageWrapperProps } from './PageWrapper.types';

const PageWrapper: FC<PageWrapperProps> = ({ children, pageModel }) => {
  const styles = useStyles(getStyles);
  const locationPath = useSelector((state: StoreState) => state.location.path);
  const currentLocation = locationPath.slice(1);

  return (
    <div className={styles.wrapper}>
      <Breadcrumb pageModel={pageModel} currentLocation={currentLocation} />
      {children}
    </div>
  );
};

export default PageWrapper;
