import React, { FC, useContext, useState } from 'react';
import { IconButton, Switch, Spinner, useStyles } from '@grafana/ui';
import { AppEvents } from '@grafana/data';
import { logger } from '@percona/platform-core';
import { appEvents } from 'app/core/app_events';
import { getStyles } from './AlertRulesActions.styles';
import { AlertRulesActionsProps } from './AlertRulesActions.types';
import { AlertRulesProvider } from '../AlertRules.provider';
import { AlertRulesService } from '../AlertRules.service';
import { Messages } from './AlertRulesActions.messages';

export const AlertRulesActions: FC<AlertRulesActionsProps> = ({ alertRule }) => {
  const styles = useStyles(getStyles);
  const [pendingRequest, setPendingRequest] = useState(false);
  const { setAddModalVisible, setSelectedAlertRule, getAlertRules } = useContext(AlertRulesProvider);
  const { ruleId, summary, disabled } = alertRule;

  const handleEditClick = () => {
    setSelectedAlertRule(alertRule);
    setAddModalVisible(true);
  };

  const handleCopyClick = async () => {
    setPendingRequest(true);

    const createAlertRulePayload = {
      template_name: alertRule.rawValues.template.name,
      channel_ids: alertRule.rawValues.channels?.map(channel => channel.channel_id),
      custom_labels: alertRule.rawValues.custom_labels,
      ...alertRule.rawValues,
      disabled: true,
      summary: `${Messages.copyOf} ${alertRule.summary}`,
    };

    try {
      await AlertRulesService.create(createAlertRulePayload);
      appEvents.emit(AppEvents.alertSuccess, [Messages.createSuccess]);
      getAlertRules();
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  const toggleAlertRule = async () => {
    setPendingRequest(true);
    try {
      await AlertRulesService.toggle({
        rule_id: ruleId,
        disabled: disabled ? 'FALSE' : 'TRUE',
      });
      appEvents.emit(AppEvents.alertSuccess, [
        disabled ? Messages.getEnabledMessage(summary) : Messages.getDisabledMessage(summary),
      ]);
      getAlertRules();
    } catch (e) {
      logger.error(e);
    } finally {
      setPendingRequest(false);
    }
  };

  return (
    <div className={styles.actionsWrapper}>
      {pendingRequest ? (
        <Spinner />
      ) : (
        <>
          <Switch value={!disabled} onClick={toggleAlertRule} data-qa="toggle-alert-rule" />
          <IconButton data-qa="edit-alert-rule-button" name="pen" onClick={handleEditClick} />
          <IconButton data-qa="copy-alert-rule-button" name="copy" onClick={handleCopyClick} />
        </>
      )}
    </div>
  );
};
