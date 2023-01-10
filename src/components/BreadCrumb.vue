<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in breadItem">
      <router-link v-if="index === 0" to="/">{{ item.meta.title }}</router-link>
      <span v-else>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue";

import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const breadItem = computed(() => {
  return route.matched;
});
// console.log(breadItem);

onMounted(() => {});
</script>
