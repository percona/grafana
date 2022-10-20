import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import usePerconaTour from 'app/percona/shared/core/hooks/tour';
import { TourType } from 'app/percona/shared/core/reducers/tour';
import { getPerconaUser } from 'app/percona/shared/core/selectors';
import { useSelector } from 'app/types';

const PerconaTourBootstrapper: React.FC = () => {
  const { startTour } = usePerconaTour();
  const location = useLocation();
  const user = useSelector(getPerconaUser);

  useEffect(() => {
    if (!user.productTourCompleted) {
      return;
    }

    if (!user.alertingTourCompleted && location.pathname.startsWith('/alerting')) {
      startTour(TourType.Alerting);
    }
  }, [startTour, user, location.pathname]);

  return null;
};

export default PerconaTourBootstrapper;
