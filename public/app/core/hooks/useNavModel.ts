import { useSelector } from 'react-redux';
import { StoreState } from 'app/types/store';
import { getNavModel } from '../selectors/navModel';
import { NavModel } from '@grafana/data';

export const useNavModel = (id: string): NavModel => {
  const navIndex = useSelector((state: StoreState) => state.navIndex);
  const model = getNavModel(navIndex, id);

  return model;
};
