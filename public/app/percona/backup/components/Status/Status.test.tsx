import React from 'react';
import { mount } from 'enzyme';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Status } from './Status';
import { BackupStatus, RestoreStatus } from '../../Backup.types';
import { Ellipsis } from 'app/percona/shared/components/Elements/Icons';
import { dataQa } from '@percona/platform-core';

describe('Status', () => {
  describe('pending states', () => {
    it('should show Ellipsis when backup is pending', () => {
      const wrapper = mount(<Status status={BackupStatus.BACKUP_STATUS_PENDING} />);
      expect(wrapper.find(Ellipsis).exists()).toBeTruthy();
      expect(wrapper.find(dataQa('statusMsg')).exists()).not.toBeTruthy();
    });

    it('should show Ellipsis when backup is in progress', () => {
      const wrapper = mount(<Status status={BackupStatus.BACKUP_STATUS_IN_PROGRESS} />);
      expect(wrapper.find(Ellipsis).exists()).toBeTruthy();
    });

    it('should show Ellipsis when restore is in progress', () => {
      const wrapper = mount(<Status status={RestoreStatus.RESTORE_STATUS_IN_PROGRESS} />);
      expect(wrapper.find(Ellipsis).exists()).toBeTruthy();
    });
  });

  describe('not pending states', () => {
    it('should show message when not pending', () => {
      const wrapper = mount(<Status status={BackupStatus.BACKUP_STATUS_SUCCESS} />);
      expect(wrapper.find(Ellipsis).exists()).not.toBeTruthy();
      expect(wrapper.find(dataQa('statusMsg')).exists()).toBeTruthy();
    });
  });

  describe('logs action', () => {
    it('should call onLogClick', () => {
      const onLogClick = jest.fn();
      render(<Status status={BackupStatus.BACKUP_STATUS_IN_PROGRESS} onLogClick={onLogClick} />);
      userEvent.click(screen.getByRole('button'));
      expect(onLogClick).toHaveBeenCalled();
    });
  });
});
