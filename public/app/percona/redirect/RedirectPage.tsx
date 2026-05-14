import { useEffect } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { PageLayoutType } from '@grafana/data';
import { Page } from 'app/core/components/Page/Page';

const RedirectPage = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.location.replace('/pmm-ui' + pathname);
  }, [pathname]);

  return (
    <Page navId="home" layout={PageLayoutType.Canvas}>
      <div>Redirecting to PMM...</div>
    </Page>
  );
};

export default RedirectPage;
