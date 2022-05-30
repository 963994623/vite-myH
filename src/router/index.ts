import { createRouter, createWebHashHistory } from "vue-router";
// import { useStore } from "vuex";
import home from "@/views/home.vue";
import storage from "../utils/storage";
import { getPermissionList } from "../api"
import utils from "../utils/util"

// import { loadAsyncRoutes } from "../utils/addRouter"
import store from "../store"
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
            // {
            //     name: 'user',
            //     path: '/system/user',
            //     meta: {
            //         title: "用户管理"
            //     },
            //     component: () => import('../views/User.vue'),
            // },
            // {
            //     name: "menu",
            //     path: '/system/menu',
            //     meta: {
            //         title: "菜单管理"
            //     },
            //     component: () => import('../views/Menu.vue')
            // },
            // {
            //     name: "role",
            //     path: '/system/role',
            //     meta: {
            //         title: "角色管理"
            //     },
            //     component: () => import('../views/Role.vue')
            // },
            // {
            //     name: "dept",
            //     path: '/system/dept',
            //     meta: {
            //         title: "部门管理"
            //     },
            //     component: () => import('../views/Dept.vue')
            // }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: "登录"
        },
        component: () => import('../views/Login.vue')
    },
    {
        name: "404",
        path: "/404",
        meta: {
            title: "页面不存在"
        },
        component: () => import('../views/404.vue')
    },


]

const route = createRouter({
    history: createWebHashHistory(),
    routes: router
})


// 获取用户拥有的菜单权限
// async function loadAsyncRoutes() {
//     let userinfo = storage.getItem("userInfo") || {}
//     if (userinfo.token) {
//         try {
//             let { MenuList } = await getPermissionList();
//             let routes = utils.generateRoute(MenuList);
//             routes.map(routeItem => {
//                 let url = `../views/${routeItem.component}.vue`
//                 routeItem.component = () => import(/* @vite-ignore */`${url}`)
//                 route.addRoute("home", routeItem);
//             })
//         } catch (error) {
//             console.log(error);

//         }
//     }
// }
// await loadAsyncRoutes();




//最新
async function loadAsyncRoutes() {

    let userinfo = storage.getItem("userInfo") || {}
    if (userinfo.token) {
        let arr: { [key: string]: Function }[] = []
        try {
            const list = import.meta.glob("../views/**.vue");
            let { MenuList } = await getPermissionList();
            let routes = utils.generateRoute(MenuList);

            routes.map(async item => {
                // for (let k in list) {
                //     let mod = await list[k]();
                //     if (item.name === mod.default.name) {
                //         let params = {
                //             name: item.name,
                //             path: item.path,
                //             meta: item.meta,
                //             component: list[k]
                //         }
                //         route.addRoute('home', params)
                //         arr.push(params)

                //     }
                // }
                for (let k in list) {
                    const name = k.substring(k.lastIndexOf("/") + 1, k.lastIndexOf("."));
                    if (item.name == name) {
                        let params = {
                            name: item.name,
                            path: item.path,
                            meta: item.meta,
                            component: list[k]
                        }
                        route.addRoute('home', params)
                        arr.push(params)
                    }

                }
            })



        } catch (error) {
            console.log(error);
        }
    }

}
await loadAsyncRoutes()
route.addRoute({
    path: "/:pathMatch(.*)",
    redirect: "/404"
})





// 判断当前地址是否可以访问
//1.注释掉因为太麻烦 需要从router里获取所有的路由地址  然后和当前跳转的路由地址进行比对 
//而使用hasRoute可以直接去对比
// function checkPermission(to: any) {
//     const list = route.getRoutes().filter(item => item.path == to.path).length;
//     if (list) {
//         return true;
//     } else {
//         return false
//     }
// }

route.beforeEach(async (to, from, next) => {
    // await loadAsyncRoutes();
    // if (from.name) {
    //     await loadAsyncRoutes();
    // }


    // if (checkPermission(to)) {
    // 2. 使用 router.hasRoute直接对比
    if (route.hasRoute(to.name as any)) {

        document.title = to.meta.title as any
        next()
    } else {
        next("/404")
    }
    // next()

})





export default route