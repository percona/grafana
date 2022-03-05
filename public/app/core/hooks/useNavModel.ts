import { useSelector } from 'react-redux';
import { StoreState } from 'app/types/store';
import { getNavModel } from '../selectors/navModel';
import { NavModel } from '@grafana/data';

export const useNavModel = (id: string, useActivePageTitleAsMainTitle = false): NavModel => {
  const navIndex = useSelector((state: StoreState) => state.navIndex);
  const model = getNavModel(navIndex, id);

  // Useful for breadcrumbs, as the main title is used as the last breadcrumb
  if (useActivePageTitleAsMainTitle) {
    model.main.text = model.node.text;
  }
  return model;
};
