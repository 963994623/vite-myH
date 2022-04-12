import { createRouter, createWebHashHistory } from "vue-router";

const router = [
    {
        path: "/",
        name: "home",
        component: () => import(/* webpackChunkName: "home" */ "../views/home.vue"),
        redirect: '/welcome',
        children: [
            {
                path: "/welcome",
                name: "welcome",
                component: () => import(/* webpackChunkName: "welcome" */ "../views/welcome.vue")
            }
        ]
    },
]
const route = createRouter({
    history: createWebHashHistory(),
    routes: router
})
export default route