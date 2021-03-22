import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@grafana/ui';
import { cx } from 'emotion';
import AddRemoteInstance from './components/AddRemoteInstance/AddRemoteInstance';
import Discovery from './components/Discovery/Discovery';
import { AddInstance } from './components/AddInstance/AddInstance';
import { getStyles } from './panel.styles';
import { Messages } from './components/AddRemoteInstance/AddRemoteInstance.messages';
import { InstanceTypes } from './panel.types';
import { useSelector } from 'react-redux';
import { StoreState } from '../../types';
import { UrlQueryValue } from '@grafana/data';
import { getLocationSrv } from '@grafana/runtime';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { DEFAULT_TAB, PAGE_MODEL } from './panel.constants';

const availableInstanceTypes = [
  InstanceTypes.rds,
  InstanceTypes.postgresql,
  InstanceTypes.mysql,
  InstanceTypes.proxysql,
  InstanceTypes.mongodb,
  InstanceTypes.external,
  InstanceTypes.haproxy,
];

const AddInstancePanel = () => {
  const styles = getStyles();
  const { path: basePath } = PAGE_MODEL;

  const activeTab = useSelector((state: StoreState) => state.location.routeParams.tab);
  const isSamePage = useSelector((state: StoreState) => state.location.path.includes(basePath));

  const isValidTab = (tab: UrlQueryValue) => Object.values(InstanceTypes).includes(tab as InstanceTypes);
  const selectTab = (tabKey: string) => {
    if (tabKey === activeTab) {
      return;
    }

    getLocationSrv().update({
      path: tabKey ? `${basePath}/${tabKey}` : basePath,
    });
  };

  useEffect(() => {
    if (!isSamePage) {
      return;
    }

    isValidTab(activeTab) || selectTab(DEFAULT_TAB);
  }, [activeTab]);

  const [selectedInstance, selectInstance] = useState({
    type: availableInstanceTypes.includes(activeTab as InstanceTypes) ? activeTab : '',
  });

  useEffect(() => {
    selectTab(selectedInstance.type as string);
  }, [selectedInstance.type]);

  const InstanceForm = useMemo(
    () => () => (
      <>
        <div className={styles.content}>
          <Button variant="secondary" onClick={() => selectTab('')} className={styles.returnButton} icon="arrow-left">
            {Messages.form.buttons.toMenu}
          </Button>
        </div>
        {selectedInstance.type === InstanceTypes.rds ? (
          <Discovery selectInstance={selectInstance} />
        ) : (
          <AddRemoteInstance instance={selectedInstance} selectInstance={selectInstance} />
        )}
      </>
    ),
    [selectedInstance]
  );

  return (
    <PageWrapper pageModel={PAGE_MODEL}>
      <div className={cx(styles.content, styles.contentPadding)}>
        {!selectedInstance.type ? <AddInstance onSelectInstanceType={selectInstance} /> : <InstanceForm />}
      </div>
    </PageWrapper>
  );
};

export default AddInstancePanel;
