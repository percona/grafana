import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { contextSrv } from 'app/core/core';
import usePerconaTour from 'app/percona/shared/core/hooks/tour';
import { TourType } from 'app/percona/shared/core/reducers/tour';
import { getPerconaSettings, getPerconaUser, getServices } from 'app/percona/shared/core/selectors';
import { isPmmAdmin } from 'app/percona/shared/helpers/permissions';
import getAlertingTourSteps from 'app/percona/tour/steps/alerting';
import getProductTourSteps from 'app/percona/tour/steps/product';
import { useSelector } from 'app/types';

const PerconaTourBootstrapper: React.FC = () => {
  const { startTour, setSteps } = usePerconaTour();
  const location = useLocation();
  const user = useSelector(getPerconaUser);
  const { result: settings } = useSelector(getPerconaSettings);
  const { activeTypes } = useSelector(getServices);
  const [shouldAlertingTourOpen, setShouldAlertingTourOpen] = useState(false);

  useEffect(() => {
    setSteps(TourType.Alerting, getAlertingTourSteps(isPmmAdmin(contextSrv.user)));
  }, [setSteps]);

  useEffect(() => {
    setSteps(TourType.Product, getProductTourSteps(isPmmAdmin(contextSrv.user), settings, activeTypes));
  }, [setSteps, settings, activeTypes]);

  useEffect(() => {
    if (!user.productTourCompleted) {
      return;
    }

    if (!shouldAlertingTourOpen && !user.alertingTourCompleted && location.pathname.startsWith('/alerting')) {
      startTour(TourType.Alerting);

      // prevent the alerting tour from opening when navigating through alerting
      // if the user dismissed it by clicking on the backdrop
      setShouldAlertingTourOpen(true);
    } else if (!location.pathname.startsWith('/alerting')) {
      setShouldAlertingTourOpen(false);
    }
  }, [startTour, user, shouldAlertingTourOpen, location.pathname]);

  return null;
};

export default PerconaTourBootstrapper;