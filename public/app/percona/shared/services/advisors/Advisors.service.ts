import { CancelToken } from 'axios';

import { Advisor } from './Advisors.types';

// const BASE_URL = `/v1/management/Advisors`;

export const AdvisorsService = {
  async list(token?: CancelToken, disableNotifications?: boolean): Promise<Advisor[]> {
    return [
      {
        name: 'advisor_1',
        summary: 'CVE Security',
        description: 'Informing users about versions of DBs affected by CVE',
        comment: 'Partial Support (MongoDB)',
        category: 'Security',
        checks: [
          {
            name: 'cve_check_1',
            disabled: false,
            summary: 'CVE check one',
            description: 'Just a description for CVE check one',
            interval: 'FREQUENT',
          },
          {
            name: 'cve_check_2',
            disabled: false,
            summary: 'CVE check two',
            description: 'Just a description for CVE check two',
            interval: 'RARE',
          },
        ],
      },
      {
        name: 'advisor_2',
        summary: 'Configuration Security',
        description: 'Make sure your DB is configured bla bla',
        comment: 'Partial Support (MySQL, MongoDB)',
        category: 'Security',
        checks: [
          {
            name: 'config_check_1',
            disabled: false,
            summary: 'Config check one',
            description: 'Just a description for Config check one',
            interval: 'FREQUENT',
          },
        ],
      },
      {
        name: 'advisor_3',
        summary: 'Query Performance',
        description: 'Query description',
        comment: 'Full Support',
        category: 'Query',
        checks: [
          {
            name: 'query_perf_1',
            disabled: false,
            summary: 'Query Perf check one',
            description: 'Just a description for Query Perf check one',
            interval: 'STANDARD',
          },
        ],
      },
    ];

    //TODO uncomment when API is ready
    // return api.post<Advisor[], void>(`${BASE_URL}/List`, undefined, disableNotifications, token);
  },
};
