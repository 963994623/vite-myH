/**
 * Mutations业务数据提交
 */
import storage from '../utils/storage';
import { stateInterface } from './vuexInterface';
export default {
    saveUserInfo(state: stateInterface, userInfo: string): void {
        state.userInfo = userInfo;
        storage.setItem('userInfo', userInfo);
    }
}