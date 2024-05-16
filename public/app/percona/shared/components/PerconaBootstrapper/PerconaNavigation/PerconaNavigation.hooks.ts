import { useEffect, useState } from 'react';

import { TypedVariableModel } from '@grafana/data';
import { getAppEvents, getTemplateSrv } from '@grafana/runtime';
import { VariablesChanged } from 'app/features/variables/types';

export const useTemplatingVariables = () => {
  const [variables, setVariables] = useState<TypedVariableModel[]>();

  useEffect(() => {
    (getAppEvents() as unknown as { name: string }).name = 'app_events';
    const sub = getAppEvents().subscribe(VariablesChanged, () => {
      setVariables(getTemplateSrv().getVariables());
    });

    return () => {
      sub.unsubscribe();
    };
  }, []);

  return variables;
};
