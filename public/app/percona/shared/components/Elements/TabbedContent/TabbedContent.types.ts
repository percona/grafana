export interface Tab {
  label: string;
  key: string;
  disabled?: boolean;
  component: JSX.Element;
}

export interface TabComponentMap {
  id: string;
  component: JSX.Element;
}

export interface TabbedContentProps {
  tabs: Tab[];
  basePath: string;
}
