import service from './service'
import { AxiosRequestConfig } from 'axios'

export default {
  get<T>(url: string, config?: AxiosRequestConfig){
    return service.request<T>({ method: 'GET', url, ...config });
  },
  post<T>(url: string, config?: AxiosRequestConfig){
    return service.request<T>({ method: 'POST', url, ...config });
  },
  put<T>(url: string, config?: AxiosRequestConfig){
    return service.request<T>({ method: 'PUT', url, ...config });
  },
  delete<T>(url: string, config?: AxiosRequestConfig){
    return service.request<T>({ method: 'DELETE', url, ...config });
  },
  cancelRequest: (url: string) => service.cancelRequest(url),
  cancelAllRequest: () => service.cancelAllRequest(),
}