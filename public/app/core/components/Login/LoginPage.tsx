// Libraries
import { css } from '@emotion/css';

// Components
import { GrafanaTheme2 } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Alert, Button, Divider, LinkButton, Stack, useStyles2, useTheme2 } from '@grafana/ui';
import { Branding } from 'app/core/components/Branding/Branding';
import { t, Trans } from 'app/core/internationalization';

import { ChangePassword } from '../ForgottenPassword/ChangePassword';

import LoginCtrl from './LoginCtrl';
import { LoginForm } from './LoginForm';
import { LoginLayout, InnerBox } from './LoginLayout';
import { LoginServiceButtons } from './LoginServiceButtons';
import { PasswordlessConfirmation } from './PasswordlessConfirmationForm';
import { PasswordlessLoginForm } from './PasswordlessLoginForm';
import { UserSignup } from './UserSignup';

const LoginPage = () => {
  const styles = useStyles2(getStyles);
  const theme = useTheme2();
  document.title = Branding.AppTitle;

  return (
    <LoginCtrl>
      {({
        loginHint,
        passwordHint,
        disableLoginForm,
        disableUserSignUp,
        login,
        passwordlessStart,
        passwordlessConfirm,
        showPasswordlessConfirmation,
        isLoggingIn,
        changePassword,
        skipPasswordChange,
        isChangingPassword,
        showDefaultPasswordWarning,
        loginErrorMessage,
        pmmDemoCredentials,
      }) => (
        <LoginLayout isChangingPassword={isChangingPassword}>
          {!isChangingPassword && !showPasswordlessConfirmation && (
            <InnerBox>
              {loginErrorMessage && (
                <Alert className={styles.alert} severity="error" title={t('login.error.title', 'Login failed')}>
                  {loginErrorMessage}
                </Alert>
              )}

              {!disableLoginForm && !config.auth.passwordlessEnabled && (
                <LoginForm onSubmit={login} loginHint={loginHint} passwordHint={passwordHint} isLoggingIn={isLoggingIn}>
                  <Stack justifyContent="flex-end">
                    {!config.auth.disableLogin && (
                      <LinkButton
                        className={styles.forgottenPassword}
                        fill="text"
                        href={`${config.appSubUrl}/user/password/send-reset-email`}
                      >
                        <Trans i18nKey="login.forgot-password">Forgot your password?</Trans>
                      </LinkButton>
                    )}
                  </Stack>
                </LoginForm>
              )}
              {config.auth.passwordlessEnabled && (
                <PasswordlessLoginForm onSubmit={passwordlessStart} isLoggingIn={isLoggingIn}></PasswordlessLoginForm>
              )}
              {/* @PERCONA */}
              {pmmDemoCredentials && (
                <>
                  <Divider direction="horizontal" spacing={2} />
                  <Button
                    disabled={isLoggingIn}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: theme.spacing(2) }}
                    variant="secondary"
                    onClick={() =>
                      login({ user: pmmDemoCredentials.username, password: pmmDemoCredentials.password, email: '' })
                    }
                  >
                    <Trans i18nKey="login.guest-login">Log in as guest</Trans>
                  </Button>
                </>
              )}
              <LoginServiceButtons />
              {!disableUserSignUp && <UserSignup />}
            </InnerBox>
          )}

          {config.auth.passwordlessEnabled && showPasswordlessConfirmation && (
            <InnerBox>
              <PasswordlessConfirmation
                onSubmit={passwordlessConfirm}
                isLoggingIn={isLoggingIn}
              ></PasswordlessConfirmation>
            </InnerBox>
          )}

          {isChangingPassword && !config.auth.passwordlessEnabled && (
            <InnerBox>
              <ChangePassword
                showDefaultPasswordWarning={showDefaultPasswordWarning}
                onSubmit={changePassword}
                onSkip={() => skipPasswordChange()}
              />
            </InnerBox>
          )}
        </LoginLayout>
      )}
    </LoginCtrl>
  );
};

export default LoginPage;

const getStyles = (theme: GrafanaTheme2) => {
  return {
    forgottenPassword: css({
      padding: 0,
      marginTop: theme.spacing(0.5),
    }),

    alert: css({
      width: '100%',
    }),
  };
};
