import { NavModelItem } from '@grafana/data';

import { getActiveItem } from '../components/NavBar/utils';

export const traverseMenuTree = (items: NavModelItem[], onItem: (item: NavModelItem) => void) => {
  for (const item of items) {
    onItem(item);

    if (item.children) {
      traverseMenuTree(item.children, onItem);
    }
  }
};

export const addParentLinks = (initial: NavModelItem[]) =>
  traverseMenuTree(initial, (item) => item.children?.forEach((child) => (child.parentItem = item)));

export const initializeState = (initial: NavModelItem[]): NavModelItem[] => {
  addParentLinks(initial);
  const activeItem = getActiveItem(initial, window.location.pathname);

  if (activeItem) {
    let current: NavModelItem | undefined = activeItem;
    current.expanded = true;

    while (current) {
      current = current.parentItem;

      if (current) {
        current.expanded = true;
      }
    }
  }

  return initial;
};
