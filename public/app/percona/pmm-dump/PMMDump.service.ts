import { CancelToken, AxiosResponse } from 'axios';

import { PmmDump, ExportDatasetProps } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';
import { api } from 'app/percona/shared/helpers/api';

import {
  DumpLogs,
  DumpLogResponse,
  SendToSupportRequestBody,
  DeleteDump,
  PmmDumpResponse,
  ExportResponse,
} from './PmmDump.types';

const BASE_URL = '/v1/management/dump/Dumps';

export const PMMDumpService = {
  async getLogs(artifactId: string, offset: number, limit: number, token?: CancelToken): Promise<DumpLogs> {
    const { logs = [], end } = await api.post<DumpLogResponse, Object>(
      `${BASE_URL}/GetLogs`,
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
  async dowload(dumpIds: string[]) {
    for (const dumpId of dumpIds) {
      api.get<AxiosResponse<Blob>, DeleteDump>(`/dump/${dumpId}.tar.gz`).then((response: AxiosResponse<Blob>) => {
        const blob = new Blob([response.data], { type: 'application/gzip' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${dumpId}.tar.gz`;

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
    }
  },
  async sendToSupport(body: SendToSupportRequestBody) {
    await api.post<void, DeleteDump>(`${BASE_URL}/Upload`, body, true);
  },
  async trigger(body: ExportDatasetProps, token?: CancelToken): Promise<string> {
    const res = await api.post<ExportResponse, ExportDatasetProps>(`${BASE_URL}/Start`, body, false, token);
    return res.dump_id;
  },
};
