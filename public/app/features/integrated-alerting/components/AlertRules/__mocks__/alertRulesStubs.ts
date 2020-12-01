import { AlertRulesListResponseRule } from '../AlertRules.types';

export const rulesStubs: AlertRulesListResponseRule[] = [
  {
    created_at: '2020-11-25T16:53:39.366Z',
    disabled: false,
    filters: [
      {
        key: 'environment',
        type: 'EQUAL',
        value: 'prod',
      },
      {
        key: 'app',
        type: 'EQUAL',
        value: 'wordpress',
      },
      {
        key: 'cluster',
        type: 'EQUAL',
        value: 'PXCCluster1',
      },
    ],
    for: '120s',
    params: [
      {
        name: 'lastNotified',
        string: '2020-11-25T16:53:39.366Z',
        type: 'STRING',
      },
    ],
    severity: 'SEVERITY_CRITICAL',
    summary: 'Database down - HR - Prod',
    template: {
      params: [
        {
          name: 'threshold',
          value: true,
        },
      ],
    },
  },
  {
    created_at: '2020-11-25T16:53:39.366Z',
    disabled: false,
    filters: [
      {
        key: 'environment',
        type: 'EQUAL',
        value: 'prod',
      },
      {
        key: 'app',
        type: 'EQUAL',
        value: 'wordpress',
      },
      {
        key: 'cluster',
        type: 'EQUAL',
        value: 'PXCCluster1',
      },
    ],
    for: '300s',
    params: [
      {
        name: 'lastNotified',
        string: '2020-11-25T16:53:39.366Z',
        type: 'STRING',
      },
    ],
    severity: 'SEVERITY_WARNING',
    summary: 'High CPU load - Sales - Prod',
    template: {
      params: [
        {
          name: 'threshold',
          value: true,
        },
      ],
    },
  },
  {
    created_at: '2020-11-25T16:53:39.366Z',
    disabled: false,
    filters: [
      {
        key: 'environment',
        type: 'EQUAL',
        value: 'prod',
      },
      {
        key: 'app',
        type: 'EQUAL',
        value: 'wordpress',
      },
      {
        key: 'cluster',
        type: 'EQUAL',
        value: 'PXCCluster1',
      },
    ],
    for: '300s',
    params: [
      {
        name: 'lastNotified',
        string: '2020-11-25T16:53:39.366Z',
        type: 'STRING',
      },
    ],
    severity: 'SEVERITY_ALERT',
    summary: 'High memory consumption - Mnfcg - Dev',
    template: {
      params: [
        {
          name: 'threshold',
          value: true,
        },
      ],
    },
  },
  {
    created_at: '2020-11-25T16:53:39.366Z',
    disabled: true,
    filters: [
      {
        key: 'environment',
        type: 'EQUAL',
        value: 'prod',
      },
      {
        key: 'app',
        type: 'EQUAL',
        value: 'wordpress',
      },
      {
        key: 'cluster',
        type: 'EQUAL',
        value: 'PXCCluster1',
      },
    ],
    for: '300s',
    params: [],
    severity: 'SEVERITY_WARNING',
    summary: 'High network throughput in - Mnfcg - Dev',
    template: {
      params: [
        {
          name: 'threshold',
          value: true,
        },
      ],
    },
  },
  {
    created_at: '2020-11-25T16:53:39.366Z',
    disabled: false,
    filters: [
      {
        key: 'environment',
        type: 'EQUAL',
        value: 'prod',
      },
      {
        key: 'app',
        type: 'EQUAL',
        value: 'wordpress',
      },
      {
        key: 'cluster',
        type: 'EQUAL',
        value: 'PXCCluster1',
      },
    ],
    for: '1500s',
    params: [
      {
        name: 'lastNotified',
        string: '2020-11-25T16:53:39.366Z',
        type: 'STRING',
      },
    ],
    severity: 'SEVERITY_INFO',
    summary: 'Low memory consumption - Sales - Dev',
    template: {
      params: [
        {
          name: 'threshold',
          value: true,
        },
      ],
    },
  },
];
