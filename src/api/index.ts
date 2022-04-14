import request from "../utils/request";

export default {
    login(params: unknown) {
        return request({
            url: "/users/login",
            data: params,
            //@ts-ignore
            mock: false,
            method: "post",
        })
    }
}