import { AxiosInstance } from 'axios';
import { ApiRequest, AxiosInstanceEx } from './api';

declare module './api' {
  export interface AxiosInstanceEx extends AxiosInstance {
    get: jest.Mock<any, any>;
    post: jest.Mock<any, any>;
    patch: jest.Mock<any, any>;
    delete: jest.Mock<any, any>;
  }
}

// Notice how `create` was not being mocked here...
const mockNoop = jest.fn();

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    default: mockNoop,
    get: mockNoop,
    post: mockNoop,
    put: mockNoop,
    delete: mockNoop,
    patch: mockNoop,
  })),
  isCancel: jest.fn(),
}));

jest.mock('app/core/app_events');

describe('GET::', () => {
  it('should return data', async () => {
    const apiRequest = new ApiRequest({});

    (apiRequest.axiosInstance as AxiosInstanceEx).get.mockResolvedValueOnce({ data: 'some data' });
    const result = await apiRequest.get('/test/path', { params: { key: 'value' } });

    expect(result).toEqual('some data');
  });
});

describe('POST::', () => {
  it('should return response data', async () => {
    const apiRequest = new ApiRequest({});

    (apiRequest.axiosInstance as AxiosInstanceEx).post.mockResolvedValueOnce({ data: 'some data' });
    const result = await apiRequest.post('/test/path', { key: 'value' });

    expect(result).toEqual('some data');
  });

  it('should display an error message on a network error', async () => {
    const response = { response: { data: { message: 'Error' } } };
    const apiRequest = new ApiRequest({});

    (apiRequest.axiosInstance as AxiosInstanceEx).post.mockImplementationOnce(() => Promise.reject(response));
    const result = apiRequest.post('/test/path', { key: 'value' });

    await expect(result).rejects.toEqual(response);
  });

  it('should display no error message if messages are disabled', async () => {
    const apiRequest = new ApiRequest({});
    const response = { message: 'Error' };

    (apiRequest.axiosInstance as AxiosInstanceEx).post.mockImplementationOnce(() => Promise.reject(response));
    const result = apiRequest.post('/test/path', { key: 'value' }, true);

    await expect(result).rejects.toEqual(response);
  });
});

describe('PATCH::', () => {
  it('should return response data', async () => {
    const apiRequest = new ApiRequest({});

    (apiRequest.axiosInstance as AxiosInstanceEx).patch.mockResolvedValueOnce({ data: 'some data' });
    const result = await apiRequest.patch('/test/path', { key: 'value' });

    await expect(result).toEqual('some data');
  });
});

describe('DELETE::', () => {
  it('should return response data', async () => {
    const apiRequest = new ApiRequest({});

    (apiRequest.axiosInstance as AxiosInstanceEx).delete.mockResolvedValueOnce({ data: 'some data' });
    const result = await apiRequest.delete('/test/path');

    await expect(result).toEqual('some data');
  });
});
