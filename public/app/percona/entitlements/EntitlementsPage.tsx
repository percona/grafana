import React, { FC } from 'react'
import PageWrapper from '../shared/components/PageWrapper/PageWrapper';
import { PAGE_MODEL } from './Entitlements.contants';

const EntitlementsPage: FC = () => {
  return (
    <PageWrapper pageModel={PAGE_MODEL}></PageWrapper>
  )
}

export default EntitlementsPage
