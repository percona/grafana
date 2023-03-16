import { FC } from 'react';
import { Provider } from 'react-redux';
import store from '../../reducers/store';

export const ComponentsWrapper: FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
