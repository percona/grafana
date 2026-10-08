import { Button, ClipboardButton, Modal, TextArea } from '@grafana/ui';
import { FC } from 'react';
import { FormattedTemplate } from '../AlertRuleTemplate.types';

interface Props {
  template: FormattedTemplate;
  visible: boolean;
  onClose: () => void;
}

const ViewAlertRuleTemplateModal: FC<Props> = ({ template, visible, onClose }) => (
  <Modal title={template.name} isOpen={visible} onDismiss={onClose}>
    <TextArea value={template.yaml} readOnly rows={template.yaml.split('\n').length} />
    <Modal.ButtonRow>
      <ClipboardButton getText={() => template.yaml}>Copy to clipboard</ClipboardButton>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Modal.ButtonRow>
  </Modal>
);

export default ViewAlertRuleTemplateModal;
