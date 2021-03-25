import React, { FC, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import TopSectionItem from './TopSectionItem';
import config from '../../config';
import { getLocationSrv } from '@grafana/runtime';
import { NavModelItem } from '@grafana/data';
import { buildIntegratedAlertingMenuItem } from './TopSection.utils';
import { FeatureLoaderService } from 'app/percona/shared/components/Elements/FeatureLoader/FeatureLoader.service';
import { LinkConfig } from './TopSection.types';

const TopSection: FC<any> = () => {
  const [showDBaaS, setShowDBaaS] = useState(false);
  const [showSTT, setShowSTT] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const navTree = _.cloneDeep(config.bootData.navTree) as NavModelItem[];
  const [mainLinks, setMainLinks] = useState(_.filter(navTree, item => !item.hideFromMenu));
  const searchLink = {
    text: 'Search',
    icon: 'search',
  };

  const linksConfig = useMemo<LinkConfig[]>(
    () => [
      {
        linkObject: {
          id: 'dbaas',
          icon: 'database',
          text: 'DBaaS',
          url: `${config.appSubUrl}/dbaas`,
        },
        show: showDBaaS,
      },
      {
        linkObject: {
          id: 'backup',
          icon: 'history',
          text: 'Backup',
          url: `${config.appSubUrl}/backup`,
        },
        show: showBackup,
      },
      {
        linkObject: {
          id: 'databsase-checks',
          icon: 'percona-database-checks',
          text: 'PMM Database checks',
          url: `${config.appSubUrl}/pmm-database-checks`,
        },
        show: showSTT,
      },
    ],
    [showDBaaS, showBackup, showSTT, config]
  );

  const onOpenSearch = () => {
    getLocationSrv().update({ query: { search: 'open' }, partial: true });
  };
  const updateMenu = async () => {
    const { settings } = await FeatureLoaderService.getSettings();
    setShowDBaaS(settings.dbaas_enabled);
    setShowSTT(settings.stt_enabled);
    setShowBackup(settings.backup_management_enabled);

    if (settings.alerting_enabled) {
      setMainLinks([...buildIntegratedAlertingMenuItem(mainLinks)]);
    }
  };

  useEffect(() => {
    if (config.bootData.user.isGrafanaAdmin) {
      updateMenu();
    }
  }, []);

  return (
    <div className="sidemenu__top">
      <TopSectionItem link={searchLink} onClick={onOpenSearch} />
      {mainLinks.map((link, index) => {
        return <TopSectionItem link={link} key={`${link.id}-${index}`} />;
      })}
      {linksConfig.map(({ show, linkObject }) => show && <TopSectionItem link={linkObject} />)}
    </div>
  );
};

export default TopSection;
