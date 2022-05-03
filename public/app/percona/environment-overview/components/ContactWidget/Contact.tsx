import { AppEvents } from '@grafana/data';
import { Icon, IconButton, IconName, useStyles2 } from '@grafana/ui';
import { logger } from '@percona/platform-core';
import appEvents from 'app/core/app_events';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { isApiCancelError } from 'app/percona/shared/helpers/api';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCancelToken } from '../../../shared/components/hooks/cancelToken.hook';
import { WidgetWrapper } from '../WidgetWrapper/WidgetWrapper';
import { CONTACT_CANCEL_TOKEN } from './Contact.constants';
import { Messages } from './Contact.messages';
import { ContactService } from './Contact.service';
import { getStyles } from './Contact.styles';
import { CustomerSuccess } from './Contact.types';

const Contact = () => {
  const [pendingRequest, setPendingRequest] = useState(true);
  const [data, setData] = useState<CustomerSuccess>();
  const { isPlatformUser } = useSelector(getPerconaUser);
  const [generateToken] = useCancelToken();
  const styles = useStyles2(getStyles);

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

  const copyToClipboard = useCallback(async () => {
    if (data) {
      await navigator.clipboard.writeText(data.email);
      appEvents.emit(AppEvents.alertSuccess, [Messages.copiedSuccessfully]);
    }
  }, [data]);

  return (
    <WidgetWrapper title={Messages.title} isPending={pendingRequest}>
      <span className={styles.contactTitle}>{Messages.customerSuccess}</span>
      {data && (
        <div className={styles.nameWrapper}>
          <Icon name={'user' as IconName} size="lg" />{' '}
          <span className={styles.name} data-testid="contact-name">
            {data?.name}
          </span>
          <IconButton
            data-testid="contact-email-icon"
            title={data?.email}
            name="envelope"
            onClick={copyToClipboard}
            size="lg"
            disabled={!data?.email}
          />
        </div>
      )}
    </WidgetWrapper>
  );
};

export default Contact;
