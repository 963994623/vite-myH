import request from "../utils/request";


export function login(params: any) {
    return request({
        url: "/users/login",
        data: params,
        mock: false,
        method: "post",
    })
}
export function notiveCount() {
    return request({
        url: "/leave/count",
        method: "get",
        data: {},
        mock: true,

    })
}
export function getMenuList(params?: any) {
    return request({
        url: "/menu/list",
        method: "get",
        data: params,
        mock: false,

    })
}
//获取菜单
export function getUserList(params?: any) {
    return request({
        url: '/users/list',
        method: 'get',
        data: params,
        mock: false,
    })
}
export function UserDel(params: any) {
    return request({
        url: '/users/delete',
        method: 'post',
        data: params,
        mock: false,
    })
}
//获取全部角色列表
export function getRoleAllList() {
    return request({
        url: '/roles/allList',
        method: 'get',
        data: {},
        mock: true,
    })
}
export function getdeptList() {
    return request({
        url: '/dept/list',
        method: 'get',
        data: {},
        mock: true,
    })
}
export function userSubmit(params: any) {
    return request({
        url: '/users/operate',
        method: 'post',
        data: params,
        mock: false,
    })
}
//菜单页  提交增删改
export function menuSubmit(params: any) {
    return request({
        url: '/menu/operate',
        method: 'post',
        data: params,
        mock: false,
    })
}

//获取角色列表
export function getRoleList(params: any) {
    return request({
        url: '/roles/list',
        method: 'get',
        data: params,
        mock: true,
    })
}
//角色的创建删除修改
export function roleOperate(params: any) {
    return request({
        url: '/roles/operate',
        method: 'post',
        data: params,
        mock: true,
    })
}

//角色权限更新
export function updatePermission(params: any) {
    return request({
        url: '/roles/update/permission',
        method: 'post',
        data: params,
        mock: true,
    })
}