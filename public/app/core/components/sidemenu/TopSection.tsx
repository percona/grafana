import React, { FC, useEffect, useState } from 'react';
import _ from 'lodash';
import TopSectionItem from './TopSectionItem';
import config from '../../config';
import { getLocationSrv, getBackendSrv } from '@grafana/runtime';

const TopSection: FC<any> = () => {
  const navTree = _.cloneDeep(config.bootData.navTree);
  const mainLinks = _.filter(navTree, item => !item.hideFromMenu);
  const searchLink = {
    text: 'Search',
    icon: 'search',
  };
  const dbaasLink = {
    id: 'dbaas',
    icon: 'database',
    text: 'DBaaS',
    url: '/graph/d/pmm-dbaas/pmm-dbaas',
  };
  const onOpenSearch = () => {
    getLocationSrv().update({ query: { search: 'open' }, partial: true });
  };
  const [showDBaaS, setShowDBaaS] = useState(false);

  // TODO: once DBaaS is enabled by default move it to config file (api/index.go)
  useEffect(() => {
    if (config.bootData.user.isSignedIn) {
      getBackendSrv()
        .post('http://localhost/v1/Settings/Get')
        .then(({ settings }) => setShowDBaaS(settings.dbaas_enabled));
    }
  }, []);

  return (
    <div className="sidemenu__top">
      <TopSectionItem link={searchLink} onClick={onOpenSearch} />
      {mainLinks.map((link, index) => {
        return <TopSectionItem link={link} key={`${link.id}-${index}`} />;
      })}
      {showDBaaS && <TopSectionItem link={dbaasLink} />}
    </div>
  );
};

export default TopSection;
