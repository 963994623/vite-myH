import { AxiosRequestConfig } from "axios"
/**
 * 对axios的参数进行扩展 待删除
 */
export interface RequestConfig extends AxiosRequestConfig {
    mock?: boolean | string | undefined
}

