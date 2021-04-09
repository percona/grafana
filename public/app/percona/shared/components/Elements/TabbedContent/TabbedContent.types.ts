export enum TabOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}
export interface ContentTab {
  label: string;
  key: string;
  disabled?: boolean;
  hidden?: boolean;
  component: JSX.Element;
}

export interface TabComponentMap {
  id: string;
  component: JSX.Element;
}

export interface TabRenderProps {
  Content: () => JSX.Element;
  tab?: ContentTab;
}

export interface TabbedContentProps {
  tabs: ContentTab[];
  basePath: string;
  orientation?: TabOrientation;
  renderTab?: (props: TabRenderProps) => void;
}
