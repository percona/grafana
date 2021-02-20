import React, { FC } from 'react';
import { Field, Form, FormRenderProps } from 'react-final-form';
import { LinkButton, useTheme } from '@grafana/ui';
import validators from 'app/percona/shared/helpers/validators';
import { showErrorNotification, showSuccessNotification } from 'app/percona/shared/helpers';
import { InputFieldAdapter } from 'app/percona/shared/components/Form/FieldAdapters/FieldAdapters';
import { Credentials, LoginFormProps } from '../types';
import { Messages } from '../PlatformLogin.messages';
import { getStyles } from '../PlatformLogin.styles';
import { PlatformLoginService } from '../PlatformLogin.service';
import { PRIVACY_POLICY_URL, TERMS_OF_SERVICE_URL } from '../PlatformLogin.constants';
import { LoaderButton, CheckboxField } from '@percona/platform-core';

const passwordValidators = validators.compose(
  validators.required,
  validators.containBothCases,
  validators.containNumbers,
  validators.minLength(8)
);

export const SignUp: FC<LoginFormProps> = ({ changeMode, getSettings }) => {
  const styles = getStyles(useTheme());

  const handleSignUpFormSubmit = async (credentials: Credentials) => {
    try {
      await PlatformLoginService.signUp(credentials);

      getSettings();
      showSuccessNotification({ message: Messages.signUpSucceeded });
    } catch (e) {
      console.error(e);
      showErrorNotification({ message: Messages.errors.signUpFailed });
    }
  };

  const CheckboxLabel: FC = () => (
    <span data-qa="sign-up-agreement-checkbox-label" className={styles.checkboxLabel}>
      {`${Messages.agreementFirstPart} `}
      <LinkButton className={styles.link} variant="link" href={TERMS_OF_SERVICE_URL}>
        {Messages.termsOfService}
      </LinkButton>
      {` ${Messages.agreementSecondPart} `}
      <LinkButton className={styles.link} variant="link" href={PRIVACY_POLICY_URL}>
        {Messages.privacyPolicy}
      </LinkButton>
    </span>
  );

  const SignUpForm: FC<FormRenderProps<Credentials>> = ({ pristine, submitting, valid, handleSubmit }) => (
    <form data-qa="sign-up-form" className={styles.form} onSubmit={handleSubmit}>
      <legend className={styles.legend}>{Messages.signUp}</legend>
      <Field
        data-qa="sign-up-email-input"
        name="email"
        label={Messages.emailLabel}
        component={InputFieldAdapter}
        validate={validators.compose(validators.required, validators.validateEmail)}
      />
      <Field
        data-qa="sign-up-password-input"
        name="password"
        label={Messages.passwordLabel}
        type="password"
        component={InputFieldAdapter}
        validate={passwordValidators}
        autoComplete="on"
      />
      <CheckboxField
        label={<CheckboxLabel />}
        data-qa="sign-up-agreement-checkbox"
        validators={[validators.requiredTrue]}
        name="agreement"
      />
      <LoaderButton
        data-qa="sign-up-submit-button"
        type="submit"
        size="md"
        variant="primary"
        disabled={!valid || submitting || pristine}
        loading={submitting}
        className={styles.submitButton}
      >
        {Messages.signUp}
      </LoaderButton>
      <LoaderButton
        data-qa="sign-up-to-sign-in-button"
        type="button"
        size="md"
        variant="link"
        disabled={submitting}
        onClick={changeMode}
        className={styles.submitButton}
      >
        {Messages.toSignIn}
      </LoaderButton>
    </form>
  );

  return <Form onSubmit={handleSignUpFormSubmit} render={SignUpForm} />;
};
