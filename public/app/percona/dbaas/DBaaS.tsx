import React, { FC, useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TabsBar, TabContent, Tab, useStyles } from '@grafana/ui';
import { UrlQueryValue } from '@grafana/data';
import { getLocationSrv } from '@grafana/runtime';
import { StoreState } from 'app/types';
import { KubernetesInventory } from './components/Kubernetes/KubernetesInventory';
import { DBCluster } from './components/DBCluster/DBCluster';
import { useKubernetes } from './components/Kubernetes/Kubernetes.hooks';
import { Messages } from './DBaaS.messages';
import { TabKeys } from './DBaaS.types';
import { getStyles } from './DBaaS.styles';
import { Breadcrumb, PageModel } from 'app/core/components/Breadcrumb';
import { DBAAS_PATH, DEFAULT_TAB } from './DBaaS.constants';

export const DBaaS: FC = () => {
  const styles = useStyles(getStyles);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const tabKey = useSelector((state: StoreState) => state.location.routeParams.tab);
  const [kubernetes, deleteKubernetes, addKubernetes, kubernetesLoading] = useKubernetes();
  const tabs = useMemo(
    () => [
      {
        label: Messages.tabs.kubernetes,
        key: TabKeys.kubernetes,
        path: `${DBAAS_PATH}/${TabKeys.kubernetes}`,
        component: (
          <KubernetesInventory
            key={TabKeys.kubernetes}
            kubernetes={kubernetes}
            deleteKubernetes={deleteKubernetes}
            addKubernetes={addKubernetes}
            loading={kubernetesLoading}
          />
        ),
      },
      {
        label: Messages.tabs.dbcluster,
        key: TabKeys.dbclusters,
        path: `${DBAAS_PATH}/${TabKeys.dbclusters}`,
        disabled: kubernetes.length === 0,
        component: <DBCluster key={TabKeys.dbclusters} kubernetes={kubernetes} />,
      },
    ],
    [kubernetes, kubernetesLoading]
  );
  const pageModel: PageModel = {
    title: 'DBaaS',
    path: DBAAS_PATH,
    id: 'dbaas',
    children: tabs.map(({ key, label, path }) => ({ id: key, title: label, path })),
  };
  const isValidTab = (tab: UrlQueryValue) => Object.values(TabKeys).includes(tab as TabKeys);
  const selectTab = (tabKey: string) => {
    getLocationSrv().update({
      path: `${DBAAS_PATH}/${tabKey}`,
    });
  };

  useEffect(() => {
    isValidTab(tabKey) || selectTab(DEFAULT_TAB);
  }, []);

  useEffect(() => {
    setActiveTab(isValidTab(tabKey) ? (tabKey as TabKeys) : DEFAULT_TAB);
  }, [tabKey]);

  return (
    <div className={styles.panelContentWrapper}>
      <Breadcrumb pageModel={pageModel} />
      <TabsBar>
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab.label}
            active={tab.key === activeTab}
            style={tab.disabled ? styles.disabled : undefined}
            onChangeTab={() => selectTab(tab.key)}
          />
        ))}
      </TabsBar>
      <TabContent>{tabs.map(tab => tab.key === activeTab && tab.component)}</TabContent>
    </div>
  );
};

export default DBaaS;
