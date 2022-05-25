<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form :model="user" status-icon :rules="rules" ref="userForm">
        <div class="title">DUXI后台管理系统</div>
        <el-form-item prop="userName">
          <el-input
            :prefix-icon="User"
            type="text"
            v-model="user.userName"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input
            type="password"
            :prefix-icon="View"
            v-model="user.userPwd"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="loginBtn" type="primary" class="btn-login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, View } from "@element-plus/icons-vue";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getPermissionList, login } from "../api";
import { useStore } from "vuex";
import { Axios, AxiosResponse } from "axios";
import storage from "../utils/storage";
import utils from "../utils/util";

const store = useStore();
const router = useRouter();
const route = useRoute();

let user = reactive({
  userName: "",
  userPwd: "",
});
//表单规则
const rules = reactive({
  userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  userPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
//登录请求
const loginBtn = () => {
  (userForm.value as any).validate(async (valid: any) => {
    if (valid) {
      login(user).then(async (res) => {
        store.commit("saveUserInfo", res);
        await loadAsyncRoutes();
        router.push("/welcome");
      });
    } else {
      return false;
    }
  });
};
const userForm = ref("0");

//获取用户拥有的菜单权限
async function loadAsyncRoutes() {
  let userinfo = storage.getItem("userInfo") || {};
  if (userinfo.token) {
    try {
      let { MenuList } = await getPermissionList();
      let routes = utils.generateRoute(MenuList);
      routes.map((routeItem) => {
        let url = `../views/${routeItem.component}.vue`;
        routeItem.component = () => import(url);
        router.addRoute("home", routeItem);
      });
    } catch (error) {
      console.log(error);
    }
  }
}
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;

  .modal {
    width: 500px;
    padding: 50px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;

    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>
