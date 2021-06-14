import React from 'react';
import { mount } from 'enzyme';
import { ScheduledBackupDetails } from './ScheduledBackupsDetails';
import { DataModel } from 'app/percona/backup/Backup.types';
import { dataQa } from '@percona/platform-core';

describe('ScheduledBackupsDetails', () => {
  it('should render', () => {
    const wrapper = mount(
      <ScheduledBackupDetails name="Backup" description="description" dataModel={DataModel.PHYSICAL} />
    );
    expect(wrapper.find(dataQa('restore-details-wrapper')).exists()).toBeTruthy();
    expect(wrapper.find(dataQa('restore-details-name')).exists()).toBeTruthy();
    expect(wrapper.find(dataQa('scheduled-backup-description')).exists()).toBeTruthy();
    expect(wrapper.find(dataQa('restore-details-data-model')).exists()).toBeTruthy();
  });
});
