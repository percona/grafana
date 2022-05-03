import { locationService } from '@grafana/runtime';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { configureStore } from 'app/store/configureStore';
import { StoreState } from 'app/types';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import Contact from './Contact';
import { ContactService } from './Contact.service';

jest.mock('app/percona/environment-overview/components/ContactWidget/Contact.service');
describe('Contact widget', () => {
  it('render contact when data were fetched successfully', async () => {
    jest.spyOn(ContactService, 'getContact').mockImplementationOnce((undefined) => {
      return Promise.resolve({
        name: 'Test name',
        email: 'test@test.com',
        newTicketUrl: 'test.url',
      });
    });
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: true },
            settings: { result: { isConnectedToPortal: true } },
          },
        } as StoreState)}
      >
        <Router history={locationService.getHistory()}>
          <Contact />
        </Router>
      </Provider>
    );
    await waitForElementToBeRemoved(() => screen.getByTestId('contact-loading'));

    expect(screen.getByTestId('contact-name').textContent).toBe('Test name');
    expect(screen.getByTestId('contact-email-icon')).toBeInTheDocument();
  });

  it('not render contact when data fetch failed', async () => {
    jest.spyOn(ContactService, 'getContact').mockImplementationOnce(() => {
      throw Error('test');
    });
    render(
      <Provider
        store={configureStore({
          percona: {
            user: { isAuthorized: true, isPlatformUser: true },
            settings: { result: { isConnectedToPortal: true } },
          },
        } as StoreState)}
      >
        <Router history={locationService.getHistory()}>
          <Contact />
        </Router>
      </Provider>
    );

    expect(screen.queryByTestId('contact-name')).not.toBeInTheDocument();
    expect(screen.queryByTestId('contact-email-icon')).not.toBeInTheDocument();
  });
});
