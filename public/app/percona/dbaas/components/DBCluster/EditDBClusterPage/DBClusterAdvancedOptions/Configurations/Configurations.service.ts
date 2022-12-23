import { SelectableValue } from '@grafana/data';

import { KubernetesService } from '../../../../Kubernetes/Kubernetes.service';

export const ConfigurationService = {
  async loadStorageClassOptions(k8sClusterName: string): Promise<Array<SelectableValue<string>>> {
    const storageClassesResponse = await KubernetesService.getStorageClasses(k8sClusterName);
    const storageClasses = storageClassesResponse?.storage_classes || [];
    const result: Array<SelectableValue<string>> = storageClasses.map((storageClass) => ({
      label: storageClass,
      value: storageClass,
    }));
    return result;
  },
};
