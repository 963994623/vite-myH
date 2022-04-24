import { AxiosRequestConfig } from "axios"
/**
 * 对axios的参数进行扩展
 */
export interface RequestConfig extends AxiosRequestConfig {
    mock?: boolean | string | undefined
}

