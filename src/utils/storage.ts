/**
 * Storage 二次封装
 * @author JackBean
 */

import config from "../config";

export default {
    setItem(key: string, value: any) {
        let storage = this.getStorage();

        storage[key] = value;
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    getItem(key: string) {
        // console.log(key);

        return this.getStorage()[key];

    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) as any || "{}");

    },
    clearItem(key: string) {
        let storage = this.getStorage();
        // delete storage[key]
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clearAll() {
        window.localStorage.clear()
    }
}