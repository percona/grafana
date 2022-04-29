import { Icon, IconName } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCancelToken } from '../../../shared/components/hooks/cancelToken.hook';
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper';
import { CONTACT_CANCEL_TOKEN } from './Contact.constants';
import { Messages } from './Contact.messages';
import { ContactService } from './Contact.service';
import { CustomerSuccess } from './Contact.types';

export const Contact = () => {
  const [pendingRequest, setPendingRequest] = useState(true);
  const [data, setData] = useState<CustomerSuccess>();
  const { isPlatformUser } = useSelector(getPerconaUser);
  const [generateToken] = useCancelToken();

  const getData = useCallback(async (showLoading = false) => {
    showLoading && setPendingRequest(true);
    try {
      const contact = await ContactService.getContact(generateToken(CONTACT_CANCEL_TOKEN));
      setData(contact);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPendingRequest(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPlatformUser === true) {
      getData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlatformUser]);

  return (
    <WidgetWrapper title={Messages.title} isPending={pendingRequest}>
      <div>
        <h4>{Messages.customerSuccess}</h4>
        <Icon name={'user-square' as IconName} size="xl" /> {data?.name}{' '}
        <Icon name={'envelope' as IconName} size="xl" /> {data?.email}
      </div>
    </WidgetWrapper>
  );
};
