import { SendToSupportRequestBody } from 'app/percona/pmm-dump/PmmDump.types';
import { api } from 'app/percona/shared/helpers/api';
import { DeleteDump, PmmDump, PmmDumpResponse } from 'app/percona/shared/services/pmmDump/pmmDump.types';

const BASE_URL = '/v1/management/dump';

const PmmDumpService = {
  async list(): Promise<PmmDump[]> {
    const response = await api.post<PmmDumpResponse, void>(`${BASE_URL}/Dumps/List`, undefined);
    return response.dumps || [];
  },
  async delete(dumpIds: string[]) {
    await api.post<void, DeleteDump>(`${BASE_URL}/Dumps/Delete`, { dump_ids: dumpIds });
  },
  async sendToSupport(body: SendToSupportRequestBody) {
    await api.post<void, DeleteDump>(`${BASE_URL}/dump/Dumps/Upload`, body);
  },
};

export default PmmDumpService;
