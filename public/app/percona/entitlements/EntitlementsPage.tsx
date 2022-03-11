import React, { FC, useCallback, useEffect, useState  } from 'react'
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { LIST_ENTITLEMENTS_CANCEL_TOKEN, PAGE_MODEL } from './Entitlements.contants';
import { logger } from '@percona/platform-core';
import { useSelector } from 'react-redux';
import { StoreState } from 'app/types';
import { CollapsableSection } from '../../../../packages/grafana-ui/src';
import { useCancelToken } from '../shared/components/hooks/cancelToken.hook';
import { isApiCancelError } from '../shared/helpers/api';
//import { getStyles } from './Entitlements.styles';
import EntitlementsService from "./Entitlements.service";
import { Entitlement } from './Entitlements.types';

const EntitlementsPage: FC = () => {
  const [pending, setPending] = useState(true);
  const [data, setData] = useState<Entitlement[]>([]);
  const connected = useSelector((state: StoreState) => !!state.perconaSettings.isConnectedToPortal);
  const [generateToken] = useCancelToken();
  //const styles = useStyles(getStyles);
data.map((value: Entitlement) => {
  console.log(value.name)
})
  const getData = useCallback(async (showLoading = false) => {
    showLoading && setPending(true);

    try {
      const entitlements = await EntitlementsService.list(generateToken(LIST_ENTITLEMENTS_CANCEL_TOKEN));
      setData(entitlements);
    } catch (e) {
      if (isApiCancelError(e)) {
        return;
      }
      logger.error(e);
    }
    setPending(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (connected === true) {
      getData(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
  <PageWrapper pageModel={PAGE_MODEL}>
    {data.map((entitlement: Entitlement) => {
      const {number, 
        name,
        summary,
        tier,
        totalUnits,
        unlimitedUnits,
        supportLevel,
        softwareFamilies,
        startDate,
        endDate,
        platform} = entitlement;
        const {securityAdvisor, configAdvisor} = platform;
    return <CollapsableSection label={name + " expire date: " + endDate} isOpen={false} >
    
    <p>Start date: {startDate}</p>
    <p>End date: {endDate}</p>
    <p>Summary: {summary}</p>
    <p>Tier: {tier}</p>
    <p>Total units: {totalUnits}</p>
    <p>Support level: {supportLevel}</p>
    <p>Platform
      Config Advisor: {configAdvisor}
      Security Advisor: {securityAdvisor}</p>
    </CollapsableSection>
  })}
    </PageWrapper>
  )
}

export default EntitlementsPage
