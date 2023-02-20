import React, { FC, memo } from 'react';

import { useUrlParams } from 'app/core/navigation/hooks';

import { DashboardSearch } from './DashboardSearch';
import { DashboardSearchModal } from './DashboardSearchModal';

export const SearchWrapper: FC = memo(() => {
  const [params] = useUrlParams();
  const isOpen = params.get('search') === 'open';
  const isTopnav = true; // @Percona

  return isOpen ? (
    isTopnav ? (
      <DashboardSearchModal isOpen={isOpen} />
    ) : (
      // TODO: remove this component when we turn on the topnav feature toggle
      <DashboardSearch />
    )
  ) : null;
});

SearchWrapper.displayName = 'SearchWrapper';
