<template>
  <h1>欢迎来到主界面</h1>
  <router-link to="/login">去登录</router-link>
</template>
<script lang="ts" setup>
import { getCurrentInstance } from "vue";
interface _thisT {
  [key: string]: any;
}
const { proxy } = getCurrentInstance() as _thisT;

console.log(proxy.$storage.getItem("password"));

</script>
