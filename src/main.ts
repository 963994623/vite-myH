import { createApp } from 'vue'
import App from './App.vue'
import { useStore } from "vuex"
import store from "./store"
import router from './router'
import request from './utils/request';
import storage from './utils/storage';
import { loadAsyncRoutes } from "./utils/addRouter"
import "@/assets/style/index.scss"

import Rocket from "../packages"

const app = createApp(App);
app.config.globalProperties.$request = request;
app.config.globalProperties.$storage = storage;

//自定义全局指令 按钮权限
app.directive('has', {
    beforeMount(el, binding, vnode) {
        // 获取按钮权限
        let actionList = store.state.actionList;
        let value = binding.value;
        //盘点列表中是否有相对应按钮权限标识
        let hasPermission = actionList.includes(value)
        if (!hasPermission) {
            el.style = 'display:none';
            setTimeout(() => {
                el.parentNode.removeChild(el);
            });
        }



    }
})

app.use(router)
await loadAsyncRoutes()
app.use(store)
app.use(Rocket)
app.mount('#app')
