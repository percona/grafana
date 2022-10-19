import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';

import { locationService } from '@grafana/runtime';
import { getRouteComponentProps } from 'app/core/navigation/__mocks__/routeProps';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';

import AddBackupPage from './AddBackupPage';

const AddBackupPageWrapper: React.FC = ({ children }) => {
  return (
    <Provider
      store={configureStore({
        percona: {
          user: { isAuthorized: true },
          settings: { loading: false, result: { isConnectedToPortal: true, alertingEnabled: true } },
        },
      } as StoreState)}
    >
      <Router history={locationService.getHistory()}>{children}</Router>
    </Provider>
  );
};

describe('AddBackupPage', () => {
  it('should render demand page backup without params', () => {
    render(
      <AddBackupPageWrapper>
        <AddBackupPage
          {...getRouteComponentProps({
            match: { params: { type: '', id: '' }, isExact: true, path: '', url: '' },
          })}
        />
      </AddBackupPageWrapper>
    );

    expect(screen.getByText('Create Backup on demand')).toBeInTheDocument();
  });
  it('should render schedule page backup with schedule params', () => {
    render(
      <AddBackupPageWrapper>
        <AddBackupPage
          {...getRouteComponentProps({
            match: { params: { type: 'scheduled_task_id', id: '' }, isExact: true, path: '', url: '' },
          })}
        />
      </AddBackupPageWrapper>
    );

    expect(screen.getByText('Create Schedule backup')).toBeInTheDocument();
  });
  it('should switch page to schedule backup page when click on schedule backup button', () => {
    render(
      <AddBackupPageWrapper>
        <AddBackupPage
          {...getRouteComponentProps({
            match: { params: { type: '', id: '' }, isExact: true, path: '', url: '' },
          })}
        />
      </AddBackupPageWrapper>
    );

    const button = screen.queryAllByTestId('type-radio-button')[1];
    fireEvent.click(button);
    expect(screen.getByText('Create Schedule backup')).toBeInTheDocument();
  });
  it('should switch back to demand backup page when click on demand backup button', () => {
    render(
      <AddBackupPageWrapper>
        <AddBackupPage
          {...getRouteComponentProps({
            match: { params: { type: 'scheduled_task_id', id: '' }, isExact: true, path: '', url: '' },
          })}
        />
      </AddBackupPageWrapper>
    );

    const button = screen.queryAllByTestId('type-radio-button')[0];
    fireEvent.click(button);
    expect(screen.getByText('Create Backup on demand')).toBeInTheDocument();
  });
});
