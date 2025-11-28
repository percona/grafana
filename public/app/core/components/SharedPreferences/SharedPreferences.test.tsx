import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { comboboxTestSetup } from 'test/helpers/comboboxTestSetup';
import { getSelectParent, selectOptionInTest } from 'test/helpers/selectOptionInTest';

import { Preferences as UserPreferencesDTO } from '@grafana/schema/src/raw/preferences/x/preferences_types.gen';

import SharedPreferences from './SharedPreferences';

// Mock getAppEvents at the module level
let mockGetAppEvents = jest.fn();
jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getAppEvents: () => mockGetAppEvents(),
}));

const selectComboboxOptionInTest = async (input: HTMLElement, optionOrOptions: string) => {
  await userEvent.click(input);
  const option = await screen.findByRole('option', { name: optionOrOptions });
  await userEvent.click(option);
};

jest.mock('app/features/dashboard/api/dashboard_api', () => ({
  getDashboardAPI: () => ({
    getDashboardDTO: jest.fn().mockResolvedValue({
      dashboard: {
        id: 2,
        title: 'My Dashboard',
        uid: 'myDash',
        templating: {
          list: [],
        },
        panels: [],
      },
      meta: {},
    }),
  }),
}));

jest.mock('app/core/services/backend_srv', () => {
  return {
    backendSrv: {
      search: jest.fn().mockResolvedValue([
        {
          id: 2,
          title: 'My Dashboard',
          tags: [],
          type: '',
          uid: 'myDash',
          uri: '',
          url: '',
          folderId: 0,
          folderTitle: '',
          folderUid: '',
          folderUrl: '',
          isStarred: true,
          slug: '',
          items: [],
        },
        {
          id: 3,
          title: 'Another Dashboard',
          tags: [],
          type: '',
          uid: 'anotherDash',
          uri: '',
          url: '',
          folderId: 0,
          folderTitle: '',
          folderUid: '',
          folderUrl: '',
          isStarred: true,
          slug: '',
          items: [],
        },
      ]),
    },
  };
});

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

const defaultPreferences: UserPreferencesDTO = {
  timezone: '',
  weekStart: '',
  theme: '',
  homeDashboardUID: '',
  queryHistory: {
    homeTab: '',
  },
  language: '',
};

const mockPrefsPatch = jest.fn();
const mockPrefsUpdate = jest.fn();
const mockPrefsLoad = jest.fn().mockResolvedValue(mockPreferences);

jest.mock('app/core/services/PreferencesService', () => ({
  PreferencesService: function () {
    return {
      patch: mockPrefsPatch,
      update: mockPrefsUpdate,
      load: mockPrefsLoad,
    };
  },
}));

const props = {
  resourceUri: '/fake-api/user/1',
  preferenceType: 'user' as const,
};

describe('SharedPreferences', () => {
  const original = window.location;
  const mockReload = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: mockReload },
    });
    comboboxTestSetup();
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  beforeEach(async () => {
    mockReload.mockReset();
    mockPrefsUpdate.mockReset();

    render(<SharedPreferences {...props} />);

    await waitFor(() => expect(mockPrefsLoad).toHaveBeenCalled());
  });

  it('renders the theme preference', async () => {
    const themeSelect = await screen.findByRole('combobox', { name: 'Interface theme' });
    expect(themeSelect).toHaveValue('Light');
  });

  it('renders the home dashboard preference', async () => {
    const dashboardSelect = getSelectParent(screen.getByLabelText('Home Dashboard'));
    await waitFor(() => {
      expect(dashboardSelect).toHaveTextContent('My Dashboard');
    });
  });

  it('renders the timezone preference', () => {
    const tzSelect = getSelectParent(screen.getByLabelText('Timezone'));
    expect(tzSelect).toHaveTextContent('Browser Time');
  });

  it('renders the week start preference', async () => {
    const weekSelect = await screen.findByRole('combobox', { name: 'Week start' });
    expect(weekSelect).toHaveValue('Monday');
  });

  it('renders the default language preference', async () => {
    const langSelect = await screen.findByRole('combobox', { name: /language/i });
    expect(langSelect).toHaveValue('Default');
  });

  it('saves the users new preferences', async () => {
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Interface theme' }), 'Dark');
    await selectOptionInTest(screen.getByLabelText('Timezone'), 'Australia/Sydney');
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Week start' }), 'Saturday');
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: /language/i }), 'Français');

    await userEvent.click(screen.getByText('Save'));

    expect(mockPrefsUpdate).toHaveBeenCalledWith({
      timezone: 'Australia/Sydney',
      weekStart: 'saturday',
      theme: 'dark',
      homeDashboardUID: 'myDash',
      queryHistory: {
        homeTab: '',
      },
      language: 'fr-FR',
    });
  });

  it('saves the users default preferences', async () => {
    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Interface theme' }), 'Default');

    // there's no default option in this dropdown - there's a clear selection button
    // get the parent container, and find the "select-clear-value" button
    const dashboardSelect = screen.getByTestId('User preferences home dashboard drop down');
    await userEvent.click(within(dashboardSelect).getByRole('button', { name: 'select-clear-value' }));

    await selectOptionInTest(screen.getByLabelText('Timezone'), 'Default');

    await selectComboboxOptionInTest(await screen.findByRole('combobox', { name: 'Week start' }), 'Default');

    await selectComboboxOptionInTest(screen.getByRole('combobox', { name: /language/i }), 'Default');

    await userEvent.click(screen.getByText('Save'));
    expect(mockPrefsUpdate).toHaveBeenCalledWith(defaultPreferences);
  });

  it('refreshes the page after saving preferences', async () => {
    await userEvent.click(screen.getByText('Save'));
    expect(mockReload).toHaveBeenCalled();
  });

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
