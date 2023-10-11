import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { BackupLogs, BackupLogResponse } from './PmmDump.types';

const BASE_URL = '/v1/management/dump';

export const PMMDumpService = {
  async getLogs(): Promise<BackupLogs> {
    let times = new Date();
    return {
      logs: [{ id: 1, data: 'logs', time: times.toString() }],
      end: true,
    };
  },

  async getLogs2(artifactId: string, offset: number, limit: number, token?: CancelToken): Promise<BackupLogs> {
    const { logs = [], end } = await api.post<BackupLogResponse, Object>(
      `${BASE_URL}/Dumps/GetDumpLogs`,
      {
        artifact_id: artifactId,
        offset,
        limit,
      },
      false,
      token
    );

    console.log(logs);
    return {
      logs: logs.map(({ chunk_id = 0, data, time }) => ({ id: chunk_id, data, time })),
      end,
    };
  },
};
