/**
 * 工具函数封装
 */

export default {
    //格式化时间
    formateDate(date: any, rule?: string) {
        let fmt = rule || "yyyy-MM-dd hh:mm:ss";
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
        }
        const o: any = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                const val = o[k] + ''
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? val : ("00" + val).substr(val.length))
            }
        }
        return fmt;
    },
    //递归动态渲染路由
    generateRoute(menuList: any) {
        let routes: any[] = [];
        const deepRouter = (list: any) => {
            while (list.length) {
                let item = list.pop();
                if (item.action) {
                    routes.push({
                        name: item.component,
                        path: item.path,
                        meta: {
                            title: item.menuName
                        },
                        component: item.component
                    })
                }
                if (item.children && !item.action) {
                    deepRouter(item.children)
                }
            }
        }
        deepRouter(menuList);
        return routes;
    }

}