import React from 'react';
import { Checkbox } from '@grafana/ui';
import { Messages } from '../Connected.messages';

interface Props {
  isChecked: boolean;
  setIsChecked: (checked: boolean) => void;
}

export const ModalBody = ({ isChecked, setIsChecked }: Props) => {
  return (
    <div>
      {Messages.modalBody} <br /> <br />
      <Checkbox value={isChecked} onChange={() => setIsChecked(!isChecked)} /> Force disconnect
    </div>
  );
};
