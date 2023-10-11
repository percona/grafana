// import { api } from "app/percona/shared/helpers/api";
import { SendToSupportForm } from 'app/percona/pmm-dump/PmmDump.types';
import { NodeTypes, PmmDump } from 'app/percona/shared/services/pmmDump/pmmDump.types';

import { deleteDump, getNode, list } from './__mocks__/PmmDump.service';
// const BASE_URL = '/v1/management/dump';

const PmmDumpService = {
  async getNodesNames(pmmDump: PmmDump): Promise<PmmDump> {
    // const response = await api.post<PmmDumpResponse, void>(`${BASE_URL}/v1/inventory/Nodes/Get`, undefined);
    let node_names: string[] = [];
    for (const nodeId of pmmDump.node_ids) {
      console.log('nodeId', nodeId);
      const nodes = (await getNode()) as NodeTypes;
      node_names.push(nodes.generic.node_name);
    }
    pmmDump.node_ids = node_names;
    return pmmDump;
  },
  async list(): Promise<PmmDump[]> {
    // const response = await api.post<PmmDumpResponse, void>(`${BASE_URL}/Dumps/List`, undefined);
    return list().then(async (pmmDumps: PmmDump[]) => {
      if (pmmDumps.length > 0) {
        for (const pmmDump of pmmDumps) {
          if (pmmDump.node_ids.length > 0) {
            await this.getNodesNames(pmmDump);
          }
        }
      }
      return pmmDumps;
    });
  },
  async delete(dumpId: string) {
    // await api.post<void, DeleteDump>(`${BASE_URL}/Dumps/Delete`, dumpId);
    return deleteDump(dumpId);
  },
  async sendToSupport(body: SendToSupportForm) {
    // await api.post<void, DeleteDump>(`${BASE_URL}/SendToSupport`, body);
    return Promise.resolve();
  },
};

export default PmmDumpService;
