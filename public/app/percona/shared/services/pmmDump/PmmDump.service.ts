// import { api } from "app/percona/shared/helpers/api";
import { SendToSupportForm } from 'app/percona/pmm-dump/PmmDump.types';
import { PmmDump } from 'app/percona/shared/services/pmmDump/pmmDump.types';

import { deleteDump, list } from './__mocks__/PmmDump.service';
// const BASE_URL = '/v1/management/dump';

const PmmDumpService = {
  async list(): Promise<PmmDump[]> {
    // const response = await api.post<PmmDumpResponse, void>(`${BASE_URL}/Dumps/List`, undefined);
    console.log(
      '------------ list ------------',
      list().then((value: PmmDump[]) => value)
    );
    return list().then((value: PmmDump[]) => value);
  },
  async delete(dumpId: string) {
    // await api.post<void, DeleteDump>(`${BASE_URL}/Dumps/Delete`, dumpId);
    return deleteDump(dumpId);
  },
  async sendToSupport(body: SendToSupportForm) {
    // await api.post<void, DeleteDump>(`${BASE_URL}/SendToSupport`, body);
    console.log('sendToSupport', body);
    return Promise.resolve();
  },
};

export default PmmDumpService;
