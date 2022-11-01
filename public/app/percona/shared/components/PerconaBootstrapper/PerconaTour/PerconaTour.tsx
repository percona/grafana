import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import usePerconaTour from 'app/percona/shared/core/hooks/tour';
import { TourType } from 'app/percona/shared/core/reducers/tour';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

const PerconaTourBootstrapper: React.FC = () => {
  const { startTour } = usePerconaTour();
  const location = useLocation();
  const user = useSelector(getPerconaUser);
  const [shouldAlertingTourOpen, setShouldAlertingTourOpen] = useState(false);

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
