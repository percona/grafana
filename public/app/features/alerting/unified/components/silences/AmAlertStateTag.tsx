import React, { FC } from 'react';

import { AlertState } from 'app/plugins/datasource/alertmanager/types';

import { State, StateTag } from '../StateTag';

const alertStateToState: Record<AlertState, State> = {
  [AlertState.Active]: 'bad',
  [AlertState.Unprocessed]: 'neutral',
  [AlertState.Suppressed]: 'info',
};

interface Props {
  state: AlertState;
  silenced?: string;
}

export const AmAlertStateTag: FC<Props> = ({ state, silenced }) => (
  <StateTag state={alertStateToState[state]}>{state === 'suppressed' ? silenced : state}</StateTag>
);
