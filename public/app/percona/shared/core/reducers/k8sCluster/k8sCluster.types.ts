export interface PerconaK8SClusterState {
  result: 'ok' | 'error' | undefined;
  loading: boolean | undefined;
}
