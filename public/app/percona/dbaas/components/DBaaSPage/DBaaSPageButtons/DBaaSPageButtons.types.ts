import { LoaderButtonProps } from 'app/percona/shared/core-ui';

export interface DBaaSPageButtonsProps {
  pageName: string;
  cancelUrl: string;
  submitBtnProps: LoaderButtonProps & { buttonMessage?: string };
}
