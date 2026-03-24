import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { locationUtil } from '@grafana/data';
import { getBackendSrv } from '@grafana/runtime';
import { LoginDTO } from 'app/core/components/Login/types';
import config from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import { getPmmAppSubUrl, isPmmNavEnabled } from 'app/percona/shared/helpers/plugin';

/**
 * True when Grafana is configured for anonymous access (`auth.anonymous` → boot settings).
 * Mirrors the anonymous check in `getSearchResultActions` (command palette): do not treat the user
 * as needing credential-based access when anonymous mode already applies.
 */
export function isAnonymousAuthEnabled(): boolean {
  return Boolean(config.anonymousEnabled || config.bootData.settings.anonymousEnabled);
}

/**
 * When PMM demo credentials exist, log in automatically only from the app home path.
 * Skipped when anonymous auth is on (Grafana already provides access without credential login).
 * Running this on the login page would re-authenticate users immediately after logout.
 */
export function PmmDemoAutoLogin() {
  const location = useLocation();
  const startedRef = useRef(false);

  useEffect(() => {
    if (
      startedRef.current ||
      contextSrv.isSignedIn ||
      isAnonymousAuthEnabled() ||
      !isAppHomePath(location.pathname)
    ) {
      return;
    }
    startedRef.current = true;

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch('/v1/users/demo/credentials');
        const data = await response.json();
        if (cancelled || !data?.username || !data?.password) {
          return;
        }

        const formModel = { user: data.username, password: data.password, email: '' };
        const loginResult = await getBackendSrv().post<LoginDTO>('/login', formModel, { showErrorAlert: false });
        if (cancelled) {
          return;
        }

        redirectAfterDemoLogin(loginResult);
      } catch {
        // Demo mode unavailable or login failed — stay on the page.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  return null;
}

function isAppHomePath(pathname: string): boolean {
  const stripped = locationUtil.stripBaseFromUrl(pathname);
  if (stripped === '' || stripped === '/') {
    return true;
  }
  return stripped.replace(/\/$/, '') === '';
}

function redirectAfterDemoLogin(result: LoginDTO | undefined) {
  if (isPmmNavEnabled()) {
    const appSubUrl = getPmmAppSubUrl();

    if (config.featureToggles.useSessionStorageForRedirection) {
      window.location.assign(appSubUrl + '/');
      return;
    }

    if (result?.redirectUrl) {
      window.location.assign(normalizePmmRedirectUrl(result.redirectUrl));
    } else {
      window.location.assign(appSubUrl + '/');
    }
    return;
  }

  if (config.featureToggles.useSessionStorageForRedirection) {
    window.location.assign(config.appSubUrl + '/');
    return;
  }

  if (result?.redirectUrl) {
    if (config.appSubUrl !== '' && !result.redirectUrl.startsWith(config.appSubUrl)) {
      window.location.assign(config.appSubUrl + result.redirectUrl);
    } else {
      window.location.assign(result.redirectUrl);
    }
  } else {
    window.location.assign(config.appSubUrl + '/');
  }
}

function normalizePmmRedirectUrl(redirectUrl: string) {
  const appSubUrl = getPmmAppSubUrl();

  if (!redirectUrl) {
    return redirectUrl;
  }

  if (redirectUrl.startsWith(appSubUrl)) {
    return redirectUrl;
  }

  if (redirectUrl.startsWith(config.appSubUrl)) {
    return redirectUrl.replace(config.appSubUrl, appSubUrl);
  }

  return appSubUrl + redirectUrl;
}
