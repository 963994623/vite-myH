<template>
  <div class="exception">
    <img src="@/assets/images/404.jpg" alt="" />
    <el-button @click="goHome()">回首页</el-button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goHome = () => {
  router.push("/");
};
</script>
