import request from "../utils/request";

//登录接口
export function login(params: any) {
    return request({
        url: "/users/login",
        data: params,
        mock: false,
        method: "post",
    })
}
//消息提醒条数 
export function notiveCount() {
    return request({
        url: "/leave/count",
        method: "get",
        data: {},
        mock: false,

    })
}
//获取菜单列表
export function getMenuList(params?: any) {
    return request({
        url: "/menu/list",
        method: "get",
        data: params,
        mock: false,

    })
}
//获取用户对应菜单列表
export function getPermissionList() {
    return request({
        url: "/users/getPermissionList",
        method: "get",
        data: {},
        mock: false,

    })
}
//获取用户列表
export function getUserList(params?: any) {
    return request({
        url: '/users/list',
        method: 'get',
        data: params,
        mock: false,
    })
}
//获取全部用户列表
export function getUserAllList(params?: any) {
    return request({
        url: '/users/all/list',
        method: 'get',
        data: params,
        mock: false,
    })
}
//用户删除
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
        mock: false,
    })
}
export function getdeptList(params: any) {
    return request({
        url: '/dept/list',
        method: 'get',
        data: params,
        mock: false,
    })
}
//增加 删除 修改 部门
export function deptOperate(params: any) {
    return request({
        url: '/dept/operate',
        method: 'post',
        data: params,
        mock: false,
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
        mock: false,
    })
}
//角色的创建删除修改
export function roleOperate(params: any) {
    return request({
        url: '/roles/operate',
        method: 'post',
        data: params,
        mock: false,
    })
}

//角色权限更新
export function updatePermission(params: any) {
    return request({
        url: '/roles/update/permission',
        method: 'post',
        data: params,
        mock: false,
    })
}


//获取审批休假列表
export function getApplyList(params: any) {
    return request({
        url: '/leave/list',
        method: 'get',
        data: params,
        mock: false,
    })
}
//创建审批条
export function leaveOperate(params: any) {
    return request({
        url: '/leave/operate',
        method: 'post',
        data: params,
        mock: false
    })
}

export function leaveApprove(params: any) {
    return request({
        url: '/leave/approve',
        method: 'post',
        data: params,
        mock: false
    })
}
