import { FC } from 'react';

import { TextLink } from '@grafana/ui';

import { ADDRESS_DOCS_LINK, Messages } from './AddressInfo.messages';

export const AddressInfo: FC = () => (
  <>
    {Messages.description}{' '}
    <TextLink inline external href={ADDRESS_DOCS_LINK}>
      {Messages.learnMore}
    </TextLink>
  </>
);
