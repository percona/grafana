import { FC } from 'react';

import { DetailsRowContent } from './DetailsRowContent';

export interface DetailsRowContentProps {
  title: string;
}

export interface DetailsRowType extends FC {
  Contents: typeof DetailsRowContent;
}
