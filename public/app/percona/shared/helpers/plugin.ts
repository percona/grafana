import { config } from '@grafana/runtime';

export const isPmmNavEnabled = () => !!config.apps['pmm-compat-app']?.preload;
