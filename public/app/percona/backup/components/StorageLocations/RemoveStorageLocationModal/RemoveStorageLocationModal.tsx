import React, { FC, useState } from 'react';
import { DeleteModal } from 'app/percona/shared/components/Elements/DeleteModal';
import { CheckboxField } from '@percona/platform-core';
import { Form } from 'react-final-form';
import { WarningBlock } from '../../../../shared/components/Elements/WarningBlock/WarningBlock';
import { Messages } from './RemoveStorageLocationModal.messages';
import { RemoveStorageLocationModalProps } from './RemoveStorageLocationModal.types';

export const RemoveStorageLocationModal: FC<RemoveStorageLocationModalProps> = ({
  location,
  isVisible,
  loading,
  onDelete,
  setVisible,
}) => {
  const [force, setForce] = useState(false);
  const handleDelete = () => onDelete(location, force);

  return (
    <DeleteModal
      title={Messages.title}
      loading={loading}
      isVisible={isVisible}
      setVisible={setVisible}
      message={Messages.getDeleteMessage(location?.name || '')}
      onDelete={handleDelete}
    >
      <Form
        onSubmit={() => {}}
        render={() => (
          <form>
            <CheckboxField
              name="force"
              label={Messages.force}
              inputProps={{ onInput: e => setForce((e.target as HTMLInputElement).checked) }}
            />
          </form>
        )}
      />
      <WarningBlock message={Messages.deleteLocationWarning} />
    </DeleteModal>
  );
};
