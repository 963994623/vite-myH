import { getPermissionList } from "../api";
import storage from "./storage";
import utils from "./util";

import route from "../router"


export async function loadAsyncRoutes() {

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