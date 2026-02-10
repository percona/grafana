import { useEffect } from 'react';

export function useMediaQueryChange({
  breakpoint,
  onChange,
}: {
  breakpoint: number;
  onChange: (e: MediaQueryListEvent) => void;
}) {
  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const onMediaQueryChange = (e: MediaQueryListEvent) => onChange(e);
    // @PERCONA
    // Sync current state when effect runs so state is correct even if initial render was wrong
    // (e.g. theme/breakpoint not ready). Without this, we only update on resize.
    // This was deeply changed on later Grafana versions
    onChange({ matches: mediaQuery.matches, media: mediaQuery.media } as MediaQueryListEvent);
    mediaQuery.addEventListener('change', onMediaQueryChange);

    return () => mediaQuery.removeEventListener('change', onMediaQueryChange);
  }, [breakpoint, onChange]);
}
