import { createRouter, createWebHashHistory } from "vue-router";
import home from "../views/home.vue";
import a from "../components/a.vue";
import b from "../components/b.vue";
const router = [
    {
        path: "/",
        name: "home",
        component: home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                component: a
            },
            {
                name: 'login',
                path: '/login',
                component: b
            }
        ]
    },
]
const route = createRouter({
    history: createWebHashHistory(),
    routes: router
})
export default route