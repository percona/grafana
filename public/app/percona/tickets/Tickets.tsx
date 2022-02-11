import React, { FC } from 'react';
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { PAGE_MODEL } from './Tickets.constants';

const TicketsPage: FC = () => {
  return <PageWrapper pageModel={PAGE_MODEL}></PageWrapper>;
};

export default TicketsPage;
