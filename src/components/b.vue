<template>
  <button @click="goHome">回首页</button>
  <el-button @click="goHome">去登录</el-button>
</template>
<script lang="ts" setup>
import { useRouter } from "vue-router";
import {
  onMounted,
  getCurrentInstance,
  Component,
  ComponentInternalInstance,
} from "vue";
const router = useRouter();
const goHome = () => {
  router.push("/welcome");
};
const { proxy } = getCurrentInstance() as any;
proxy.$storage.getItem("futurefe");
</script>
