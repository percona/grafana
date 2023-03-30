import { CancelToken } from 'axios';

import * as fileService from '../File.service';

export const { FileService } = jest.genMockFromModule<typeof fileService>('../File.service');

FileService.get = (name: string, cancelToken?: CancelToken) =>
  Promise.resolve({
    name,
    content: '',
    updated_at: '',
  });

FileService.update = () => Promise.resolve({});

export default FileService;
