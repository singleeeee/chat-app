import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig } from 'axios'
interface IResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // 10s
  withCredentials: true,
})

const abortContollerMap: Map<string, AbortController> = new Map()

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const controller = new AbortController();
  config.signal = controller.signal;
  abortContollerMap.set(config.url!, controller);
  return config;
})

axiosInstance.interceptors.response.use((response: AxiosResponse) => {
  const code = response.status;
  switch(code) {
    case 401: 
      console.log('401');
      break;
    case 403:
      console.log('403');
      break;
    case 404:
      console.log('404');
      break;
    default:
      break;
  }
  abortContollerMap.delete(response.config.url!);
  return response;
})

export default {
  request: <T>(config: AxiosRequestConfig): Promise<IResponse<T>> => new Promise(resolve => {
    axiosInstance.request(config)
    .then((res) => {
      resolve(res.data);
    })
    .catch((err) => {
      console.log(err, '捕捉到错误');
      resolve({
        code: err.code || 500,
        data: err.response?.data || {},
        message: err.message || '服务器错误',
        success: false,
      });
    })
  }),
  cancelRequest: (url: string) => {
    const controller = abortContollerMap.get(url);
    controller?.abort();
  },
  cancelAllRequest: () => {
    abortContollerMap.forEach((controller) => {
      controller.abort();
    })
    abortContollerMap.clear();
  }
}
