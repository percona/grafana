import React, { FC } from 'react';
import { cx } from 'emotion';
import { Icon, useStyles } from '@grafana/ui';
import { getStyles } from './ResourcesBar.styles';
import { ResourcesBarProps } from './ResourcesBar.types';
import { getResourcesWidth } from './ResourcesBar.utils';
import { Messages } from './ResourcesBar.messages';

export const ResourcesBar: FC<ResourcesBarProps> = ({ total, allocated, expected, resourceLabel, icon, dataQa }) => {
  const styles = useStyles(getStyles);
  const requiredResources = allocated + expected;
  const allocatedWidth = getResourcesWidth(allocated, total);
  const expectedWidth = getResourcesWidth(requiredResources, total);
  const isResourceInsufficient = requiredResources > total;

  return (
    <div data-qa={dataQa} className={styles.resourcesBarWrapper}>
      <div data-qa="resources-bar-icon" className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.resourcesBarContent}>
        <div data-qa="resources-bar" className={styles.resourcesBarBackground}>
          {isResourceInsufficient ? (
            <div className={cx(styles.filled, styles.filledInsufficient, styles.getFilledStyles(100))} />
          ) : (
            <div className={cx(styles.filled, styles.filledExpected, styles.getFilledStyles(expectedWidth))} />
          )}
          <div className={cx(styles.filled, styles.filledAllocated, styles.getFilledStyles(allocatedWidth))} />
        </div>
        <span data-qa="resources-bar-label" className={styles.resourcesBarLabel}>
          {Messages.buildResourcesLabel(allocated, total)}
        </span>
        {isResourceInsufficient ? (
          <div className={styles.captionWrapper}>
            <Icon className={styles.insufficientIcon} name="exclamation-triangle" />
            <span data-qa="resources-bar-insufficient-resources" className={styles.captionLabel}>
              {Messages.buildInsufficientLabel(resourceLabel)}
            </span>
          </div>
        ) : (
          <>
            <div className={styles.captionWrapper}>
              <div className={cx(styles.captionSquare, styles.allocatedSquare)}></div>
              <span data-qa="resources-bar-allocated-caption" className={styles.captionLabel}>
                {Messages.buildAllocatedLabel(allocated, resourceLabel)}
              </span>
            </div>
            <div className={styles.captionWrapper}>
              <div className={cx(styles.captionSquare, styles.expectedSquare)}></div>
              <span data-qa="resources-bar-expected-caption" className={styles.captionLabel}>
                {Messages.buildExpectedLabel(expected, resourceLabel)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
