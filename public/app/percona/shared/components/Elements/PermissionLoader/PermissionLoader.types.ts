import { StoreState } from 'app/types/store';

export interface PermissionLoaderProps {
  featureSelector: (state: StoreState) => boolean;
  renderSuccess: () => React.ReactNode;
  renderError: () => React.ReactNode;
}
