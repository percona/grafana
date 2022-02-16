import React from 'react';
import { Messages } from '../../DBaaS.messages';
import { ADVANCED_SETTINGS_URL } from '../DBCluster/DBCluster.constants';

export const buildWarningMessage = (className: string) => (
  <>
    {Messages.dbcluster.publicAddressWarningBegin}
    &nbsp;
    <a href={ADVANCED_SETTINGS_URL} className={className}>
      {Messages.dbcluster.publicAddressWarningLink}
    </a>
    &nbsp;
    {Messages.dbcluster.publicAddressWarningEnd}
  </>
);
