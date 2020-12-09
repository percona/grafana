import React, { FC, useState } from 'react';
import { Button, useStyles } from '@grafana/ui';
import { AlertRulesTable } from './AlertRulesTable';
import { AddAlertRuleModal } from './AddAlertRuleModal';
import { getStyles } from './AlertRules.styles';
import { Messages } from '../../IntegratedAlerting.messages';

export const AlertRules: FC = () => {
  const styles = useStyles(getStyles);
  const [addModalVisible, setAddModalVisible] = useState(false);

  return (
    <>
      <div className={styles.actionsWrapper}>
        <Button
          size="md"
          icon="plus-square"
          variant="link"
          onClick={() => setAddModalVisible(!addModalVisible)}
          data-qa="alert-rule-template-add-modal-button"
        >
          {Messages.alertRuleTemplate.addAction}
        </Button>
      </div>
      <AddAlertRuleModal isVisible={addModalVisible} setVisible={setAddModalVisible} />
      <AlertRulesTable />
    </>
  );
};
