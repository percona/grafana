import { useEffect, useState } from 'react';
import { Branding } from 'app/core/components/Branding/Branding';

export const usePageTitle = (title?: string) => {
  const [pageTitle, setPageTitle] = useState(title);

  useEffect(() => {
    document.title = `${Branding.AppTitle}${pageTitle ? ' - ' + pageTitle : ''}`;
  }, [pageTitle]);

  return [pageTitle, setPageTitle] as const;
};
