import React, { FC, useEffect, useMemo } from 'react';
import { Field } from 'react-final-form';

import { useDispatch, useSelector } from 'app/types';

import { AsyncSelectFieldAdapter } from '../../../../../../shared/components/Form/FieldAdapters/FieldAdapters';
import { fetchDBaaSTemplatesAction } from '../../../../../../shared/core/reducers';
import { getDbaaSTemplates } from '../../../../../../shared/core/selectors';
import { DatabaseToDBClusterTypeMapping } from '../../../DBCluster.types';
import { AdvancedOptionsFields } from '../DBClusterAdvancedOptions.types';

import { Messages } from './Templates.messages';
import { TemplatesProps } from './Templates.types';
import { getTemplatesOptions } from './Templates.utils';

export const Templates: FC<TemplatesProps> = ({ k8sClusterName, databaseType }) => {
  const dispatch = useDispatch();
  const { result, loading } = useSelector(getDbaaSTemplates);

  const templatesOptions = useMemo(() => getTemplatesOptions(result), [result]);

  useEffect(() => {
    const dbClusterType = DatabaseToDBClusterTypeMapping[databaseType];
    if (dbClusterType) {
      dispatch(fetchDBaaSTemplatesAction({ k8sClusterName, dbClusterType }));
    }
  }, [databaseType, dispatch, k8sClusterName]);

  return (
    <Field
      dataTestId="templates-field"
      name={AdvancedOptionsFields.template}
      label={Messages.labels.templates}
      component={AsyncSelectFieldAdapter}
      loading={loading}
      options={templatesOptions}
    />
  );
};

export default Templates;
