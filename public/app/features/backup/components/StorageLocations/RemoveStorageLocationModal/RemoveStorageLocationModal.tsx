import { DeleteModal } from 'app/features/integrated-alerting/components/DeleteModal';
import React, { FC } from 'react';
import { Messages } from './RemoveStorageLocationModal.messages';
import { RemoveStorageLocationModalProps } from './RemoveStorageLocationModal.types';

export const RemoveStorageLocationModal: FC<RemoveStorageLocationModalProps> = ({
  location,
  isVisible,
  loading,
  onDelete,
  setVisible,
}) => {
  const handleDelete = () => onDelete(location);
  return (
    <DeleteModal
      loading={loading}
      isVisible={isVisible}
      setVisible={setVisible}
      message={Messages.getDeleteMessage(location?.name || '')}
      onDelete={handleDelete}
    />
  );
};
