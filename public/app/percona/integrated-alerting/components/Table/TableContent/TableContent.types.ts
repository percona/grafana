import React from 'react';

export interface TableContentProps {
  hasData: boolean;
  emptyMessage: React.ReactNode;
  loading?: boolean;
}
