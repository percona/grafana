import { CancelToken } from 'axios';

import { PmmDump } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';
import { api } from 'app/percona/shared/helpers/api';

import { DumpLogs, DumpLogResponse, SendToSupportRequestBody, DeleteDump, PmmDumpResponse } from './PmmDump.types';

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
        service_names: services,
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
    return {
      logs: logs.map(({ chunk_id = 0, data, time }) => ({ id: chunk_id, data, time })),
      end,
    };
  },
  async list(): Promise<PmmDump[]> {
    const response = await api.post<PmmDumpResponse, void>(`${BASE_URL}/List`, undefined);
    return response.dumps || [];
  },
  async delete(dumpIds: string[]) {
    await api.post<void, DeleteDump>(`${BASE_URL}/Delete`, { dump_ids: dumpIds });
  },
  async sendToSupport(body: SendToSupportRequestBody) {
    await api.post<void, DeleteDump>(`${BASE_URL}/Upload`, body);
  },
};
