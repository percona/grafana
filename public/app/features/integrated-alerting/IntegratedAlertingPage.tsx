import React, { FC } from 'react';
import Page from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';

const IntegratedAlertingPage: FC = () => {
  const navModel = useNavModel('channels');

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <></>
      </Page.Contents>
    </Page>
  );
};

export default IntegratedAlertingPage;
