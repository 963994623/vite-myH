import { ElMessage } from "element-plus"
//封装提示信息
export function success(msg: string) {
    ElMessage.success(msg)
}
export function error(msg: string) {
    ElMessage.error(msg)
}