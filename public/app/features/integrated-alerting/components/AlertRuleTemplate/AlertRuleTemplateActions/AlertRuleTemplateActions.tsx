import React, { FC, useState } from 'react';
import { IconButton, useStyles } from '@grafana/ui';
import { EditAlertRuleTemplateModal } from '../EditAlertRuleTemplateModal/EditAlertRuleTemplateModal';
import { getStyles } from './AlertRuleTemplateActions.styles';
import { AlertRuleTemplateActionsProps } from './AlertRuleTemplateActions.types';

export const AlertRuleTemplateActions: FC<AlertRuleTemplateActionsProps> = ({ template, getAlertRuleTemplates }) => {
  const styles = useStyles(getStyles);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const { yaml } = template;

  return (
    <div className={styles.actionsWrapper}>
      <IconButton data-qa="edit-template-button" name="pen" onClick={() => setEditModalVisible(true)} />
      <EditAlertRuleTemplateModal
        yaml={yaml}
        isVisible={editModalVisible}
        setVisible={setEditModalVisible}
        getAlertRuleTemplates={getAlertRuleTemplates}
      />
    </div>
  );
};
