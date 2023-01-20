import React, { useState } from 'react';

import { locationService } from '@grafana/runtime';
import { Menu, Dropdown, IconButton } from '@grafana/ui';

import DeleteServiceModal from '../DeleteServiceModal/DeleteServiceModal';

import { Messages } from './ServicesOptions.messages';
import { styles } from './ServicesOptions.styles';
import { ServicesOptionsProps } from './ServicesOptions.types';

const ServicesOptions: React.FC<ServicesOptionsProps> = ({ service }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEdit = () => {
    const serviceId = service.service_id.split('/').pop();
    locationService.push(`/edit-instance/${serviceId}`);
  };

  const menu = () => (
    <Menu>
      <Menu.Item ariaLabel={Messages.editAria} label={Messages.edit} icon="pen" onClick={handleEdit} />
      <Menu.Item ariaLabel={Messages.deleteAria} label={Messages.delete} icon="trash-alt" onClick={openModal} />
    </Menu>
  );

  return (
    <div className={styles.Cell}>
      <DeleteServiceModal
        serviceId={service.service_id}
        serviceName={service.service_name}
        isOpen={isModalOpen}
        onCancel={closeModal}
      />
      <Dropdown overlay={menu}>
        <IconButton ariaLabel={Messages.optionsAriaLabel} name="ellipsis-v" />
      </Dropdown>
    </div>
  );
};

export default ServicesOptions;
