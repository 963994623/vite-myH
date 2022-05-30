export interface stateInterface {
    userInfo: string;
    menuList: Menu[];
    actionList: string[];
    noticeCount: number,
    addRoutes: any[],
}


export interface Menu {
    chilren?: Menu[]
    createTime: string
    menuName: string
    menuState: menuState
    menuType: menuState
    parentId: string[]
    path: string
    updateTime: string
    _v: number
    _id: string
    action?: Menu[]
    menuCode?: string
}


// 菜单激活禁用状态  |菜单按钮类型
type menuState = 1 | 2;