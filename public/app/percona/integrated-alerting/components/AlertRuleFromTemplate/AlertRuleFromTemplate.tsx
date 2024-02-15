import React, { FC, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button, HorizontalGroup, Spinner, useStyles2 } from '@grafana/ui';
import { AppChromeUpdate } from 'app/core/components/AppChrome/AppChromeUpdate';
import { Page } from 'app/core/components/Page/Page';
import { useAppNotification } from 'app/core/copy/appNotification';
import { useQueryParams } from 'app/core/hooks/useQueryParams';
import { useUnifiedAlertingSelector } from 'app/features/alerting/unified/hooks/useUnifiedAlertingSelector';
import { saveRuleFormAction } from 'app/features/alerting/unified/state/actions';
import { RuleFormType, RuleFormValues } from 'app/features/alerting/unified/types/rule-form';
import { initialAsyncRequestState } from 'app/features/alerting/unified/utils/redux';
import { getDefaultFormValues, getDefaultQueries, MINUTE } from 'app/features/alerting/unified/utils/rule-form';
import { useDispatch } from 'app/types';

import { TemplateStep } from '../TemplateStep/TemplateStep';

import { getStyles } from './AlertRuleFromTemplate.styles';

export const AlertRuleFromTemplate: FC = () => {
  const dispatch = useDispatch();
  const notifyApp = useAppNotification();
  const [queryParams] = useQueryParams();
  const evaluateEvery = MINUTE;
  const returnTo = !queryParams['returnTo'] ? '/alerting/list' : String(queryParams['returnTo']);
  const defaultValues: RuleFormValues = useMemo(() => {
    return {
      ...getDefaultFormValues(),
      condition: 'C',
      queries: getDefaultQueries(),
      evaluateEvery: evaluateEvery,
      type: RuleFormType.templated,
    };
  }, [evaluateEvery]);
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
    shouldFocusError: true,
  });
  const styles = useStyles2(getStyles);
  const submitState = useUnifiedAlertingSelector((state) => state.ruleForm.saveRule) || initialAsyncRequestState;

  const submit = (values: RuleFormValues) => {
    dispatch(
      saveRuleFormAction({
        values: {
          ...defaultValues,
          ...values,
          annotations:
            values.annotations
              ?.map(({ key, value }) => ({ key: key.trim(), value: value.trim() }))
              .filter(({ key, value }) => !!key && !!value) ?? [],
          labels:
            values.labels
              ?.map(({ key, value }) => ({ key: key.trim(), value: value.trim() }))
              .filter(({ key }) => !!key) ?? [],
        },
        redirectOnSave: returnTo,
        initialAlertRuleName: defaultValues.name,
        evaluateEvery: evaluateEvery,
      })
    );
  };

  const onInvalid = () => {
    notifyApp.error('There are errors in the form. Please correct them and try again!');
  };

  const actionButtons = (
    <HorizontalGroup height="auto" justify="flex-end">
      <Button
        variant="primary"
        type="button"
        size="sm"
        onClick={methods.handleSubmit((values) => submit(values), onInvalid)}
        disabled={submitState.loading}
      >
        {submitState.loading && <Spinner className={styles.buttonSpinner} inline={true} />}
        Save rule and exit
      </Button>
      <Link to={returnTo}>
        <Button variant="secondary" disabled={submitState.loading} type="button" size="sm">
          Cancel
        </Button>
      </Link>
    </HorizontalGroup>
  );

  return (
    <FormProvider {...methods}>
      <AppChromeUpdate actions={actionButtons} />
      <Page navId="integrated-alerting-new-from-template">
        <TemplateStep />
      </Page>
    </FormProvider>
  );
};

export default AlertRuleFromTemplate;
