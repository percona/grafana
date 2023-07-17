import { useEffect } from 'react';

import { fetchTeamDetailsAction } from 'app/percona/shared/core/reducers/team/team';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

export const useFetchTeamDetails = () => {
  const dispatch = useAppDispatch();
  const { result } = useSelector(getPerconaSettings);

  useEffect(() => {
    if (result?.enableAccessControl) {
      dispatch(fetchTeamDetailsAction());
    }
  }, [result?.enableAccessControl, dispatch]);
};
