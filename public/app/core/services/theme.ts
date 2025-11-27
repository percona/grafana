import { getThemeById } from '@grafana/data/src/themes/registry';
import { ThemeChangedEvent } from '@grafana/runtime';

import appEvents from '../app_events';
import { config } from '../config';
import { contextSrv } from '../core';

import { PreferencesService } from './PreferencesService';

export async function changeTheme(themeId: string, runtimeOnly?: boolean) {
  const oldTheme = config.theme2;

  const newTheme = getThemeById(themeId);

  // Add css file for new theme
  if (oldTheme.colors.mode !== newTheme.colors.mode) {
    const newCssLink = document.createElement('link');
    newCssLink.rel = 'stylesheet';
    newCssLink.href = config.bootData.assets[newTheme.colors.mode];

    // Publish ThemeChangedEvent AFTER CSS loads to ensure UI components (like theme dropdown)
    // update synchronously with the actual rendered theme. This prevents visual lag where
    // the dropdown updates immediately but the page content updates later.
    const publishThemeChange = () => {
      appEvents.publish(new ThemeChangedEvent(newTheme));

      // Remove old css file only after new one is loaded to prevent flickering
      const bodyLinks = document.getElementsByTagName('link');
      for (let i = 0; i < bodyLinks.length; i++) {
        const link = bodyLinks[i];

        if (link.href && link.href.includes(`build/grafana.${oldTheme.colors.mode}`)) {
          link.remove();
        }
      }
    };

    newCssLink.onload = publishThemeChange;
    // Ensure event is published even if CSS fails to load (network error, ad blocker, etc.)
    // to prevent UI from getting stuck in inconsistent state
    newCssLink.onerror = publishThemeChange;

    document.head.insertBefore(newCssLink, document.head.firstChild);
  } else {
    // Same mode (e.g., light -> light with different variant), publish event immediately
    appEvents.publish(new ThemeChangedEvent(newTheme));
  }

  if (runtimeOnly) {
    return;
  }

  if (!contextSrv.isSignedIn) {
    return;
  }

  // Persist new theme
  const service = new PreferencesService('user');
  const currentPref = await service.load();

  await service.update({
    ...currentPref,
    theme: newTheme.colors.mode,
  });
}

export async function toggleTheme(runtimeOnly: boolean) {
  const currentTheme = config.theme2;
  changeTheme(currentTheme.isDark ? 'light' : 'dark', runtimeOnly);
}
