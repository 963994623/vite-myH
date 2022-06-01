<template>
  <template v-for="menu in userMenu">
    <el-sub-menu
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :index="menu.path"
    >
      <template #title>
        <i :class="menu.icon"></i>
        <span>{{ menu.menuName }}</span>
      </template>
      <TreeMenu :userMenu="menu.children"></TreeMenu>
    </el-sub-menu>
    <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path">{{
      menu.menuName
    }}</el-menu-item>
  </template>
</template>

<script lang="ts" setup>
import { User, View } from "@element-plus/icons-vue";
import { onMounted } from "vue";
const name = "TreeMenu";

interface Ani {
  userMenu: Array<any> | null;
}
//接受数据
const props = withDefaults(defineProps<Ani>(), {
  userMenu: () => [],
});
</script>
