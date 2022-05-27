import React, { useState, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { useLocalStorage } from 'react-use';
import { useAppDispatch } from 'app/store/store';
import {
  fetchSettingsAction,
  setAuthorized,
  fetchServerInfoAction,
  fetchServerSaasHostAction,
  fetchUserStatusAction,
} from 'app/percona/shared/core/reducers';
import { contextSrv } from 'app/core/services/context_srv';
import { Button, HorizontalGroup, Icon, Modal, useStyles2 } from '@grafana/ui';
import { getStyles } from './PerconaBootstrapper.styles';

// This component is only responsible for populating the store with Percona's settings initially
export const PerconaBootstrapper = () => {
  const dispatch = useAppDispatch();
  const { setCurrentStep, setIsOpen } = useTour();
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [showTour, setShowTour] = useLocalStorage<boolean>('percona.showTour', true);
  const styles = useStyles2(getStyles);
  const isLoggedIn = !!contextSrv.user.isSignedIn;

  const dismissModal = () => {
    setModalIsOpen(false);
    setShowTour(false);
  };

  useEffect(() => {
    setCurrentStep(0);

    const getSettings = async () => {
      try {
        await dispatch(fetchSettingsAction()).unwrap();
        dispatch(setAuthorized(true));
      } catch (e) {
        if (e.response?.status === 401) {
          setAuthorized(false);
        }
      }
    };

    const bootstrap = async () => {
      await getSettings();
      await dispatch(fetchUserStatusAction());
      await dispatch(fetchServerInfoAction());
      await dispatch(fetchServerSaasHostAction());
      // setTimeout(() => setIsOpen(true), 2000);
    };

    if (isLoggedIn) {
      bootstrap();
    }
  }, [dispatch, isLoggedIn, setCurrentStep, setIsOpen]);

  return isLoggedIn && showTour ? (
    <Modal onDismiss={dismissModal} isOpen={modalIsOpen} title=" Welcome to Percona Monitoring and Management">
      <div className={styles.iconContainer}>
        <Icon type="mono" name="pmm-logo" className={styles.svg} />
      </div>
      <p>
        <strong>Percona Monitoring and Management</strong> Percona Monitoring and Management (PMM) is an open source
        database monitoring, management, and observability solution for MySQL, PostgreSQL, and MongoDB.
      </p>
      <p>
        It allows you to observe the health of your database systems, explore new patterns in their behavior,
        troubleshoot them and perform database management operations no matter where they are located - on-prem or in
        the cloud.
      </p>
      <ul className={styles.list}>
        <li>PMM collects thousands of out-of-the-box performance metrics from databases and their hosts.</li>
        <li>The PMM web UI visualizes data in dashboards.</li>
        <li>Additional features include advisors for database health assessments.</li>
      </ul>
      <p>
        For more information, please check our{' '}
        <a
          href="https://docs.percona.com/percona-monitoring-and-management/index.html"
          target="_blank"
          rel="noreferrer noopener"
          className={styles.docsLink}
        >
          documentation
        </a>
        .
      </p>
      <HorizontalGroup justify="center" spacing="md">
        <Button>Start tour</Button>
        <Button variant="secondary" onClick={dismissModal}>
          Skip
        </Button>
      </HorizontalGroup>
    </Modal>
  ) : (
    <></>
  );
};
