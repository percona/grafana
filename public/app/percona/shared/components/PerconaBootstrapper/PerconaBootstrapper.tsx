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
import { isPmmAdmin } from '../../helpers/permissions';

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

  const startTour = () => {
    setModalIsOpen(false);
    setCurrentStep(0);
    setIsOpen(true);
  };

  useEffect(() => {
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
    };

    if (isLoggedIn) {
      bootstrap();
    }
  }, [dispatch, isLoggedIn, setCurrentStep, setIsOpen]);

  return isLoggedIn && isPmmAdmin(contextSrv.user) && showTour ? (
    <Modal onDismiss={dismissModal} isOpen={modalIsOpen} title=" Welcome to Percona Monitoring and Management">
      <div className={styles.iconContainer}>
        <Icon type="mono" name="pmm-logo" className={styles.svg} />
      </div>
      <p>
        <strong>Percona Monitoring and Management</strong> (PMM) is an open source database monitoring and management
        tool for MySQL, PostgreSQL and MongoDB.
      </p>
      <p>
        PMM enables you to:
        <ul className={styles.list}>
          <li>
            Spot critical performance issues faster, understand the root cause of incidents better and troubleshoot them
            more efficiently;
          </li>
          <li>Monitor your database performance with customizable dashboards and real-time alerting;</li>
          <li>
            Run regular database health checks with built-in Advisors. The checks identify and alert you of potential
            security threats, performance degradation, data loss and data corruption;
          </li>
          <li>Back up your critical data with zero-downtime and minimal performance impact.</li>
        </ul>
      </p>
      <p>
        For more information, please check out the{' '}
        <a
          href="https://docs.percona.com/percona-monitoring-and-management/index.html"
          target="_blank"
          rel="noreferrer noopener"
          className={styles.docsLink}
        >
          PMM online help
        </a>
        .
      </p>
      <HorizontalGroup justify="center" spacing="md">
        <Button onClick={startTour}>Start tour</Button>
        <Button variant="secondary" onClick={dismissModal}>
          Skip
        </Button>
      </HorizontalGroup>
    </Modal>
  ) : (
    <></>
  );
};
