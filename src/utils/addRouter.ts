import { getPermissionList } from "../api";
import storage from "./storage";
import utils from "./util";
import { useRouter } from "vue-router";
const router = useRouter()

export async function loadAsyncRoutes() {
    const modules = import.meta.glob('../views/**.vue');
    let AjArr = AJ(modules);
    let userinfo = storage.getItem("userInfo") || {}
    if (userinfo.token) {
        try {
            let { MenuList } = await getPermissionList();
            let routes = utils.generateRoute(MenuList);
            console.log(routes);

            routes.map(routeItem => {
                // let url = `../views/${routeItem.component}.vue`
                // routeItem.component = () => import(`/* @vite-ignore */ ${url}`)
                // route.addRoute("home", routeItem);
                if (routeItem.name.includes(Object.keys(AjArr))) {
                    let params = {
                        name: routeItem.name,
                        path: Object.keys(AjArr[routeItem.name])[0].toLowerCase(),
                        meta: routeItem.meta,
                        component: Object.values(AjArr[routeItem.name])[0]
                    }

                    console.log(params);


                    router.addRoute("home", params as any);
                }

            })

        } catch (error) {
            console.log(error);

        }
    }
}
// 将对象在外扩展一层
function AJ(mapJson: any) {
    let json: { [key: string]: { [key: string]: string } } = {};
    for (let key in mapJson) {
        let lindex = key.lastIndexOf(".");
        let citrus = key.substring(9, lindex);
        json[citrus] = {
            [key]: mapJson[key]
        }
    }
    return json;
}