<template>
  <h1>欢迎来到主界面</h1>
  <router-link to="/login">去登录</router-link>
</template>
<script lang="ts" setup>
import {
  onMounted,
  getCurrentInstance,
  Component,
  ComponentInternalInstance,
} from "vue";
interface _thisT {
  [key: string]: any;
}
const { proxy } = getCurrentInstance() as _thisT;
onMounted(() => {
  proxy
    .$request({
      method: "get",
      url: "login",
      data: {
        name: "javkl",
      },
    })
    .then((res: any) => {
      console.log(res);
    });
});
</script>
