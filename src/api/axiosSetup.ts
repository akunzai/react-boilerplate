import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: '/api',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
};

export function axiosFactory(
  config: AxiosRequestConfig = axiosRequestConfig
): AxiosInstance {
  const axiosInstance = axios.create(config);
  // add interceptors to axiosInstance ...
  // https://axios-http.com/docs/interceptors
  return axiosInstance;
}
