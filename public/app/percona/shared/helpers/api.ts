import axios, { CancelToken, AxiosInstance, AxiosError } from 'axios';
import { AppEvents } from '@grafana/data';
import { appEvents } from 'app/core/app_events';
import { ApiError, ApiErrorCode, ApiVerboseError } from '../core';

export class ApiRequest {
  axiosInstance: AxiosInstance;

  constructor(params: object) {
    this.axiosInstance = axios.create({
      ...params,
    });
  }

  async get<T, B>(path: string, query?: { params: B; cancelToken?: CancelToken }): Promise<T> {
    return this.axiosInstance
      .get<T>(path, query)
      .then((response): T => response.data)
      .catch((e) => {
        appEvents.emit(AppEvents.alertError, [e.message]);
        throw e;
      });
  }

  async post<T, B>(path: string, body: B, disableNotifications = false, cancelToken?: CancelToken): Promise<T> {
    return this.axiosInstance
      .post<T>(path, body, { cancelToken })
      .then((response): T => response.data)
      .catch((e) => {
        if (!disableNotifications && !axios.isCancel(e)) {
          appEvents.emit(AppEvents.alertError, [e.response.data?.message ?? 'Unknown error']);
        }

        throw e;
      });
  }

  async delete<T>(path: string): Promise<T> {
    return this.axiosInstance
      .delete<T>(path)
      .then((response): T => response.data)
      .catch((e) => {
        // Notify.error(e.message);
        throw e;
      });
  }

  async patch<T, B>(path: string, body: B): Promise<T> {
    return this.axiosInstance
      .patch<T>(path, body)
      .then((response): T => response.data)
      .catch((e) => {
        // Notify.error(e.message);
        throw e;
      });
  }
}

export const api = new ApiRequest({});
export const apiQAN = new ApiRequest({ baseURL: '/v0/qan' });
export const apiManagement = new ApiRequest({ baseURL: '/v1/management' });
export const apiInventory = new ApiRequest({ baseURL: '/v1/inventory' });
export const apiSettings = new ApiRequest({ baseURL: '/v1/Settings' });
export const isApiCancelError = (e: any) => axios.isCancel(e);

export const translateApiError = (error: ApiErrorCode): ApiVerboseError | undefined => {
  const map: Record<ApiErrorCode, ApiVerboseError> = {
    [ApiErrorCode.ERROR_CODE_INVALID_XTRABACKUP]: {
      message: 'Different versions of xtrabackup and xbcloud.',
      link: '',
    },
    [ApiErrorCode.ERROR_CODE_XTRABACKUP_NOT_INSTALLED]: {
      message: 'Xtrabackup is not installed.',
      link: 'https://www.percona.com/doc/percona-xtrabackup/8.0/installation.html',
    },
    [ApiErrorCode.ERROR_CODE_INCOMPATIBLE_XTRABACKUP]: {
      message: 'Xtrabackup version is not compatible.',
      link: 'https://www.percona.com/doc/percona-xtrabackup/8.0/installation.html',
    },
    [ApiErrorCode.ERROR_CODE_INCOMPATIBLE_TARGET_MYSQL]: {
      message: 'Target MySQL version is not compatible.',
      link: 'https://www.percona.com/doc/percona-xtrabackup/8.0/installation.html',
    },
  };

  const translatedError = map[error];

  return translatedError;
};

export const apiErrorParser = (e: AxiosError): ApiVerboseError[] => {
  const errorData: ApiError = e.response?.data;
  let result: ApiVerboseError[] = [];

  if (errorData) {
    const { details = [] } = errorData;

    result = details.reduce((acc, current) => {
      const translatedError = translateApiError(current.code);
      return translatedError ? [...acc, translatedError] : acc;
    }, []);
  }

  return result;
};
