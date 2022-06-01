import * as axios from 'axios'
//解决axios拦截器的问题
declare module 'axios' {
    interface AxiosInstance {
        (config: AxiosRequestConfig): Promise<any>
    }
}