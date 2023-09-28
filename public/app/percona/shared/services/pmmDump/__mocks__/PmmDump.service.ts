export const list = () =>
  Promise.resolve([
    {
      dump_id: '123',
      status: 'BACKUP_STATUS_INVALID',
      node_ids: ['1', '2', '3'],
      start_time: '2023-09-20T18:55:53.486Z',
      end_time: '2023-09-20T18:57:53.486Z',
      created_at: '2023-09-26T07:40:01.547Z',
    },
  ]);

export const nodeList = (node_ids: string[]) =>
  Promise.resolve([
    {
      dump_id: '123',
      status: 'BACKUP_STATUS_INVALID',
      node_ids: ['1', '2', '3'],
      start_time: '2023-09-20T18:55:53.486Z',
      end_time: '2023-09-20T18:57:53.486Z',
      created_at: '2023-09-26T07:40:01.547Z',
    },
  ]);

export const deleteDump = (dumpId: string) => Promise.resolve();
