import axios, { CancelToken, AxiosInstance, CreateAxiosDefaults } from 'axios';

export class ApiRequest {
  axiosInstance: AxiosInstance;

  constructor(params: CreateAxiosDefaults<any>) {
    this.axiosInstance = axios.create({
      ...params,
    });
  }

  async get<T, B>(path: string, query?: { params: B; cancelToken?: CancelToken }): Promise<T> {
    return this.axiosInstance
      .get<T>(path, query)
      .then((response): T => response.data)
      .catch((e) => {
        // showErrorNotification({ message: e.message });
        throw e;
      });
  }

  async post<T, B>(path: string, body: B, disableNotifications = false, cancelToken?: CancelToken): Promise<T> {
    return this.axiosInstance
      .post<T>(path, body, { cancelToken })
      .then((response): T => response.data)
      .catch((e) => {
        if (!disableNotifications && !axios.isCancel(e)) {
          // showErrorNotification({ message: e.response.data?.message ?? 'Unknown error' });
        }

        throw e;
      });
  }

  async delete<T>(path: string): Promise<T> {
    return this.axiosInstance
      .delete<T>(path)
      .then((response): T => response.data)
      .catch((e) => {
        // showErrorNotification({ message: e.message });
        throw e;
      });
  }

  async patch<T, B>(path: string, body: B): Promise<T> {
    return this.axiosInstance
      .patch<T>(path, body)
      .then((response): T => response.data)
      .catch((e) => {
        // showErrorNotification({ message: e.message });
        throw e;
      });
  }
}

export const apiTelemetryOnboarding = new ApiRequest({ baseURL: '/v1/telemetry/onboarding' });
export const apiOnboarding = new ApiRequest({ baseURL: '/v1/onboarding' });
