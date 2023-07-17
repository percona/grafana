import { useEffect } from 'react';

import { fetchUsersListAction } from 'app/percona/shared/core/reducers/users/users';
import { getPerconaSettings } from 'app/percona/shared/core/selectors';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'app/types';

export const useFetchUserList = () => {
  const dispatch = useAppDispatch();
  const { result } = useSelector(getPerconaSettings);

  useEffect(() => {
    if (result?.enableAccessControl) {
      dispatch(fetchUsersListAction());
    }
  }, [result?.enableAccessControl, dispatch]);
};
