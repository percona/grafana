import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { BackupLogs, BackupLogResponse } from './PmmDump.types';
// import { Service } from './components/ExportDataset/ExportDataset.types';

const BASE_URL = '/v1/management/dump/Dump';

export const PMMDumpService = {
  async triggerBackup(
    services: object | undefined,
    startTime: string,
    endTime: string,
    qan: boolean | undefined,
    load: boolean | undefined,
    token?: CancelToken
  ) {
    return api.post(
      `${BASE_URL}/Start`,
      {
        node_ids: services,
        start_time: startTime,
        end_time: endTime,
        export_qan: qan,
        ignore_load: load,
      },
      false,
      token
    );
  },

  async getLogs(): Promise<BackupLogs> {
    let times = new Date();
    return {
      logs: [{ id: 1, data: 'logs', time: times.toString() }],
      end: true,
    };
  },

  async getLogs2(artifactId: string, offset: number, limit: number, token?: CancelToken): Promise<BackupLogs> {
    const { logs = [], end } = await api.post<BackupLogResponse, Object>(
      `${BASE_URL}/GetDumpLogs`,
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
