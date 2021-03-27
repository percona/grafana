import React, { FC, useEffect, useState } from 'react';
import DiscoveryService from './Discovery.service';
import Credentials from './components/Credentials/Credentials';
import Instances from './components/Instances/Instances';
import { getStyles } from './Discovery.styles';
import { DiscoverySearchPanelProps } from './Discovery.types';

const Discovery: FC<DiscoverySearchPanelProps> = ({ selectInstance }) => {
  const styles = getStyles();

  const [instances, setInstances] = useState([] as any);
  const [credentials, setCredentials] = useState({ aws_secret_key: '', aws_access_key: '' });
  const [loading, startLoading] = useState(false);

  useEffect(() => {
    const updateInstances = async () => {
      try {
        const result = await DiscoveryService.discoveryAzure(credentials);
        console.log(result.azure_database_instance);
        if (result) {
          setInstances(result.azure_database_instance);
        }
      } catch (e) {
        console.error(e);
      } finally {
        startLoading(false);
      }
    };
    startLoading(true);
    updateInstances();
    // if (credentials.aws_secret_key && credentials.aws_access_key) {
    //   startLoading(true);
    //   updateInstances();
    // }
  }, [credentials]);

  return (
    <>
      <div className={styles.content}>
        <Credentials onSetCredentials={setCredentials} selectInstance={selectInstance} />
        <Instances instances={instances} selectInstance={selectInstance} credentials={credentials} loading={loading} />
      </div>
    </>
  );
};

export default Discovery;
