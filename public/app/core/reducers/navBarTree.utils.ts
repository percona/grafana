import { NavModelItem } from '@grafana/data';

export const traverseMenuTree = (items: NavModelItem[], onItem: (item: NavModelItem) => void) => {
  for (const item of items) {
    onItem(item);

    if (item.children) {
      traverseMenuTree(item.children, onItem);
    }
  }
};
