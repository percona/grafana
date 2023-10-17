import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { DumpLogs, DumpLogResponse } from './PmmDump.types';
// import { Service } from './components/ExportDataset/ExportDataset.types';

const BASE_URL = '/v1/management/dump/Dumps';

export const PMMDumpService = {
  async triggerDump(
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

  async getLogs(artifactId: string, offset: number, limit: number, token?: CancelToken): Promise<DumpLogs> {
    const { logs = [], end } = await api.post<DumpLogResponse, Object>(
      `${BASE_URL}/GetDumpLogs`,

      {
        dump_id: artifactId,
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
