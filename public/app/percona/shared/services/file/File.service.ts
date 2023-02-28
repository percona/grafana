import { CancelToken } from 'axios';

import { api } from 'app/percona/shared/helpers/api';

import { GetFilePayload, GetFileResponse, UpdateFilePayload } from './File.types';

const BASE_URL = `/v1/File`;

export const FileService = {
  get: (name: string, cancelToken?: CancelToken) =>
    api.post<GetFileResponse, GetFilePayload>(`${BASE_URL}/Get`, { name }, false, cancelToken),
  update: (payload: UpdateFilePayload, cancelToken?: CancelToken) =>
    api.post<{}, UpdateFilePayload>(`${BASE_URL}/Update`, payload, false, cancelToken),
};
