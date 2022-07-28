import { cx } from '@emotion/css';
import React, { FC, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { IconButton, Tooltip, useStyles2 } from '@grafana/ui';

import { SourceDescription } from '../AlertRuleTemplate.types';
import { DeleteRuleTemplateModal } from '../DeleteRuleTemplateModal/DeleteRuleTemplateModal';
import { EditAlertRuleTemplateModal } from '../EditAlertRuleTemplateModal/EditAlertRuleTemplateModal';

import { getStyles } from './AlertRuleTemplateActions.styles';
import { AlertRuleTemplateActionsProps } from './AlertRuleTemplateActions.types';

const nonActionableSources = [SourceDescription.BUILT_IN, SourceDescription.USER_FILE, SourceDescription.SAAS];

export const AlertRuleTemplateActions: FC<AlertRuleTemplateActionsProps> = ({ template, getAlertRuleTemplates }) => {
  const styles = useStyles2(getStyles);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const { source, yaml, name, summary } = template;
  const isActionDisabled = useMemo(() => nonActionableSources.includes(source), [source]);

  return (
    <div className={styles.actionsWrapper}>
      <Tooltip placement="top" content="Create alert rule from this template">
        <Link
          to={`/alerting/new?returnTo=%2Falerting%2Falert-rule-templates&template=${template.name}`}
          className={styles.actionLink}
        >
          <IconButton data-testid="create-from-template-button" name="plus" size="lg" className={styles.button} />
        </Link>
      </Tooltip>
      <Tooltip placement="top" content="Edit">
        <IconButton
          data-testid="edit-template-button"
          name="pen"
          size="lg"
          className={cx(styles.button, styles.editButton)}
          disabled={isActionDisabled}
          onClick={() => setEditModalVisible(true)}
        />
      </Tooltip>
      <Tooltip placement="top" content="Delete">
        <IconButton
          data-testid="delete-template-button"
          name="times"
          size="xl"
          className={cx(styles.button)}
          disabled={isActionDisabled}
          onClick={() => setDeleteModalVisible(true)}
        />
      </Tooltip>
      <EditAlertRuleTemplateModal
        yaml={yaml}
        name={name}
        summary={summary}
        isVisible={editModalVisible}
        setVisible={setEditModalVisible}
        getAlertRuleTemplates={getAlertRuleTemplates}
      />
      <DeleteRuleTemplateModal
        template={template}
        setVisible={setDeleteModalVisible}
        getAlertRuleTemplates={getAlertRuleTemplates}
        isVisible={deleteModalVisible}
      />
    </div>
  );
};
