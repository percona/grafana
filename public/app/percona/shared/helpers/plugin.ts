import { config } from '@grafana/runtime';

export const isPmmNavEnabled = () => !!config.apps['pmm-compat-app']?.preload;

export const getPmmAppSubUrl = () => '/pmm-ui' + (config.appSubUrl || '');
