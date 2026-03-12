import { comboboxTestSetup } from 'test/helpers/comboboxTestSetup';
import { getSelectParent, selectOptionInTest } from 'test/helpers/selectOptionInTest';
import { render, screen, userEvent, waitFor, within, cleanup, act } from 'test/test-utils';

import { setBackendSrv } from '@grafana/runtime';
import { Preferences as UserPreferencesDTO } from '@grafana/schema/src/raw/preferences/x/preferences_types.gen';
import { setupMockServer } from '@grafana/test-utils/server';
import { getFolderFixtures } from '@grafana/test-utils/unstable';
import { backendSrv } from 'app/core/services/backend_srv';
import { captureRequests } from 'app/features/alerting/unified/mocks/server/events';

import SharedPreferences from './SharedPreferences';

// @PERCONA
// Mock getAppEvents at the module level
let mockGetAppEvents = jest.fn();
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getAppEvents: () => mockGetAppEvents(),
}));

const props = {
  resourceUri: '/fake-api/user/1',
  preferenceType: 'user' as const,
};

const mockPreferences: UserPreferencesDTO = {
  timezone: 'browser',
  weekStart: 'monday',
  theme: 'light',
  homeDashboardUID: 'myDash',
  queryHistory: {
    homeTab: '',
  },
  language: '',
};

const mockPrefsLoad = jest.fn().mockResolvedValue(mockPreferences);

setBackendSrv(backendSrv);
setupMockServer();

const getPrefsUpdateRequest = async (requests: Request[]) => {
  const prefsUpdate = requests.find((r) => r.url.match('/preferences') && r.method === 'PUT');

  return prefsUpdate!.clone().json();
};

const [_, { dashbdD, dashbdE }] = getFolderFixtures();

const selectComboboxOptionInTest = async (input: HTMLElement, optionOrOptions: string | RegExp) => {
  const user = userEvent.setup();
  await user.click(input);
  const option = await screen.findByRole('option', { name: optionOrOptions });
  await user.click(option);
};

const setup = async () => {
  const view = render(<SharedPreferences resourceUri="user" preferenceType="user" />);
  const themeSelect = await screen.findByRole('combobox', { name: 'Interface theme' });
  await waitFor(() => expect(themeSelect).not.toBeDisabled());
  return view;
};

const original = window.location;
const mockReload = jest.fn();

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      ...original,
      reload: mockReload,
    },
  });
  comboboxTestSetup();
});

afterAll(() => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: original,
  });
});

describe('SharedPreferences', () => {
  it('renders the theme preference', async () => {
    await setup();
    const themeSelect = await screen.findByRole('combobox', { name: 'Interface theme' });
    await waitFor(() => expect(themeSelect).toHaveValue('Light'));
  });

  it('renders the home dashboard preference', async () => {
    await setup();
    const dashboardSelect = getSelectParent(screen.getByLabelText('Home Dashboard'));
    await waitFor(() => {
      expect(dashboardSelect).toHaveTextContent(dashbdD.item.title);
    });
  });

  it('renders the timezone preference', async () => {
    await setup();
    const tzSelect = getSelectParent(screen.getByLabelText('Timezone'));
    expect(tzSelect).toHaveTextContent('Browser Time');
  });

  it('renders the week start preference', async () => {
    await setup();
    const weekSelect = await screen.findByRole('combobox', { name: 'Week start' });
    expect(weekSelect).toHaveValue('Monday');
  });

  it('renders the default language preference', async () => {
    await setup();
    const langSelect = await screen.findByRole('combobox', { name: /language/i });
    expect(langSelect).toHaveValue('Default');
  });

  it('does not render the pseudo-locale', async () => {
    const { user } = await setup();
    const langSelect = await screen.findByRole('combobox', { name: /language/i });

    // Open the combobox and wait for the options to be rendered
    await user.click(langSelect);
    expect((await screen.findAllByRole('option'))[0]).toBeInTheDocument();

    await user.clear(langSelect);
    await user.type(langSelect, 'Pseudo', {
      // Don't click on the element again when typing as this would just re-set the value
      skipClick: true,
    });

    const option = screen.queryByRole('option', { name: 'Pseudo-locale' });
    expect(option).not.toBeInTheDocument();
  });

  it('saves the users new preferences', async () => {
    const dashboardToSelect = dashbdE.item;
    const capture = captureRequests();
    const { user } = await setup();

    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Interface theme' }), 'Dark');
    await selectComboboxOptionInTest(
      await screen.findByRole('combobox', { name: /home dashboard/i }),
      new RegExp(dashboardToSelect.title)
    );
    await selectOptionInTest(screen.getByLabelText('Timezone'), 'Australia/Sydney');
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Week start' }), 'Saturday');
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: /language/i }), 'Français');

    await user.click(screen.getByText('Save preferences'));

    const requests = await capture;
    const newPreferences = await getPrefsUpdateRequest(requests);

    expect(newPreferences).toEqual({
      timezone: 'Australia/Sydney',
      weekStart: 'saturday',
      theme: 'dark',
      homeDashboardUID: dashboardToSelect.uid,
      queryHistory: {
        homeTab: '',
      },
      language: 'fr-FR',
    });
  });

  it('saves the users default preferences', async () => {
    const capture = captureRequests();
    const { user } = await setup();
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Interface theme' }), 'Default');

    // there's no default option in this dropdown - there's a clear selection button
    // get the parent container, and find the "Clear value" button
    const dashboardSelect = screen.getByTestId('User preferences home dashboard drop down');
    await user.click(within(dashboardSelect).getByRole('button', { name: 'Clear value' }));

    await selectOptionInTest(screen.getByLabelText('Timezone'), 'Default');

    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Week start' }), 'Default');

    await selectComboboxOptionInTest(screen.getByRole('combobox', { name: /language/i }), 'Default');

    await user.click(screen.getByText('Save preferences'));
    const requests = await capture;
    const newPreferences = await getPrefsUpdateRequest(requests);
    expect(newPreferences).toEqual({
      timezone: '',
      weekStart: '',
      theme: '',
      homeDashboardUID: '',
      queryHistory: {
        homeTab: '',
      },
      language: '',
    });
  });

  it('refreshes the page after saving preferences', async () => {
    const { user } = await setup();
    await user.click(screen.getByText('Save preferences'));
    expect(mockReload).toHaveBeenCalled();
  });

  // @PERCONA
  describe('ThemeChangedEvent subscription', () => {
    let mockEventBus: {
      subscribe: jest.Mock;
      unsubscribe: jest.Mock;
    };

    beforeEach(() => {
      // Cleanup the render from the parent beforeEach
      cleanup();

      mockEventBus = {
        subscribe: jest.fn(),
        unsubscribe: jest.fn(),
      };
      mockGetAppEvents.mockReturnValue(mockEventBus);
    });

    it('subscribes to ThemeChangedEvent on mount', async () => {
      render(<SharedPreferences {...props} />);
      await waitFor(() => expect(mockPrefsLoad).toHaveBeenCalled());

      expect(mockEventBus.subscribe).toHaveBeenCalledWith(
        expect.anything(), // ThemeChangedEvent
        expect.any(Function)
      );
    });

    it('updates theme state when ThemeChangedEvent is received with dark theme', async () => {
      let eventHandler: ((evt: any) => void) | undefined;
      mockEventBus.subscribe.mockImplementation((_event, handler) => {
        eventHandler = handler;
        return { unsubscribe: mockEventBus.unsubscribe };
      });

      render(<SharedPreferences {...props} />);
      await waitFor(() => expect(mockPrefsLoad).toHaveBeenCalled());

      // Wait for the form to be fully loaded and verify initial theme is light
      const themeSelect = await screen.findByRole('combobox', { name: /Interface theme/i });
      expect(themeSelect).toHaveValue('Light');

      // Simulate ThemeChangedEvent with dark theme using proper GrafanaTheme2 structure
      act(() => {
        eventHandler?.({ payload: { colors: { mode: 'dark' } } });
      });

      await waitFor(() => {
        expect(themeSelect).toHaveValue('Dark');
      });
    });

    it('updates theme state when ThemeChangedEvent is received with light theme', async () => {
      // Reset mockPrefsLoad to return dark theme for this test
      mockPrefsLoad.mockResolvedValueOnce({ ...mockPreferences, theme: 'dark' });

      let eventHandler: ((evt: any) => void) | undefined;
      mockEventBus.subscribe.mockImplementation((_event, handler) => {
        eventHandler = handler;
        return { unsubscribe: mockEventBus.unsubscribe };
      });

      render(<SharedPreferences {...props} />);
      await waitFor(() => expect(mockPrefsLoad).toHaveBeenCalled());

      // Wait for the form to be fully loaded and verify initial theme is dark
      const themeSelect = await screen.findByRole('combobox', { name: /Interface theme/i });
      await waitFor(() => {
        expect(themeSelect).toHaveValue('Dark');
      });

      // Simulate ThemeChangedEvent with light theme using proper GrafanaTheme2 structure
      act(() => {
        eventHandler?.({ payload: { colors: { mode: 'light' } } });
      });

      await waitFor(() => {
        expect(themeSelect).toHaveValue('Light');
      });
    });

    it('unsubscribes from ThemeChangedEvent on unmount', async () => {
      const unsubscribeMock = jest.fn();
      mockEventBus.subscribe.mockReturnValue({ unsubscribe: unsubscribeMock });

      const { unmount } = render(<SharedPreferences {...props} />);
      await waitFor(() => expect(mockPrefsLoad).toHaveBeenCalled());

      unmount();

      expect(unsubscribeMock).toHaveBeenCalled();
    });
  });
});
