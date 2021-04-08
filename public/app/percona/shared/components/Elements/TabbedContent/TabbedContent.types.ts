export interface ContentTab {
  label: string;
  key: string;
  disabled?: boolean;
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
  renderTab?: (props: TabRenderProps) => void;
}
