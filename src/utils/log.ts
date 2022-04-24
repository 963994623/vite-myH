import { ElMessage } from "element-plus"
export function success(msg: string) {
    ElMessage.success(msg)
}
export function error(msg: string) {
    ElMessage.error(msg)
}