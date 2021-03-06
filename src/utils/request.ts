import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from "axios"
import { ElMessage } from "element-plus";
import 'element-plus/dist/index.css'

import config from "../config"
import router from '../router'
import { RequestConfig } from './interface';
import storage from './storage'


const TOKEN_INVALID = "token认证失败"
const NETWORK_ERROR = "网络错误"
//创建axios对象 添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000,

})
//请求拦截器
service.interceptors.request.use((req: AxiosRequestConfig) => {

    //TODO
    const { token } = storage.getItem('userInfo') || "";
    const headers: any = req.headers;

    if (!headers.Authorization) {
        headers.Authorization = "Bearer " + token
    }

    return req

})

//相应拦截
service.interceptors.response.use((res: AxiosResponse) => {
    const { code, data, msg } = res.data;

    if (code === 200) {
        return data;
    } else if (code === 50001) {
        ElMessage(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 5000)

        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})
/**
 * 请求核心函数
 * @param {*} options 请求配置 
 */
function request(options: RequestConfig) {

    options.method = options.method || 'get';
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }

    //做局部mock判定   因为config下做了全局的mock为true 
    if (typeof options.mock !== 'undefined') {
        config.mock = options.mock

    }


    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi

    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }

    return service(options)
}
['get', 'post', 'put', 'delete'].forEach(item => {
    //@ts-ignore
    request[item] = (url: string, data: any, options: any) => {
        return request({
            url,
            method: item,
            data,
            ...options
        })
    }
})

export default request