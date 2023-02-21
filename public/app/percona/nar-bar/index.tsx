import React, { ReactNode } from 'react';

export const settings = {
  showLogo: false,
  orderNavBarItems: (search: ReactNode, core: ReactNode[], plugins: ReactNode[]): ReactNode => {
    return (
      <>
        {plugins}
        {search}
        {core}
      </>
    );
  },
};
