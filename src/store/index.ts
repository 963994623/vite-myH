/**
 * VueX状态管理
 */
import { createStore } from "vuex";
import mutations from "./mutations";
import storage from "../utils/storage";
import { stateInterface } from "./vuexInterface"




const state: stateInterface = {
    userInfo: storage.getItem("userInfo") || {},    //获取用户信息
    menuList: storage.getItem("menuList") || [],    //获取菜单列表
    actionList: storage.getItem("actionList") || [],    //获取操作列表
    noticeCount: 0
}




export default createStore({
    state,
    mutations
})