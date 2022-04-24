import { createRouter, createWebHashHistory } from "vue-router";
import home from "@/views/home.vue";
const router = [
    {
        path: "/",
        name: "home",
        component: home,
        meta: {
            title: "首页"
        },
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: "欢迎页"
                },
                component: () => import('../views/welcome.vue')
            },
            {
                name: 'user',
                path: '/user',
                meta: {
                    title: "用户管理"
                },
                component: () => import('../views/User.vue'),
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: "登录"
        },
        component: () => import('../views/Login.vue')
    }
]
const route = createRouter({
    history: createWebHashHistory(),
    routes: router
})
export default route