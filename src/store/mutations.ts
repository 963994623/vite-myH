/**
 * Mutations业务数据提交
 */
import storage from '../utils/storage';
import { stateInterface, Menu } from './vuexInterface';
export default {
    saveUserInfo(state: stateInterface, userInfo: string): void {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo);
    },
    saveMenuList(state: stateInterface, menuList: Menu[]): void {
        state.menuList = menuList;
        storage.setItem('menuList', menuList);
    },
    saveActionList(state: stateInterface, actionList: string[]): void {
        state.actionList = actionList;
        storage.setItem('actionList', actionList);
    },
    saveNotiveCount(state: stateInterface, count: number): void {
        state.noticeCount = count;
        storage.setItem('noticeCount', count);
    },
    saveAddRoutes(state: stateInterface, addRoutes: any[]): void {
        state.addRoutes = addRoutes;
        // storage.setItem('addRoutes', addRoutes);
    }
}