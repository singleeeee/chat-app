import { AxiosRequestConfig, AxiosResponse } from 'axios'

export function defaultRequestInterceptor(config: AxiosRequestConfig) {
  return config;
}

export function defaultResponseInterceptor(response: AxiosResponse) {
  const url = response.config.url;
  const sendData = { params: response.config.params, data: response.config.data };
  console.log(url, sendData, response.data);
  return response.data;
}

