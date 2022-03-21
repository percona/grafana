import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import Page from 'app/core/components/Page/Page';
import { useNavModel } from 'app/core/hooks/useNavModel';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { TechnicalPreview } from 'app/percona/shared/components/Elements/TechnicalPreview/TechnicalPreview';
import { Connected } from './Connected/Connected';
import { Connect } from './Connect/Connect';

export const Platform: FC = () => {
  const navModel = useNavModel('settings-percona-platform', true);
  const { isConnectedToPortal } = useSelector(getPerconaUser);
  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <TechnicalPreview />
        {isConnectedToPortal ? <Connected /> : <Connect />}
      </Page.Contents>
    </Page>
  );
};

export default Platform;
