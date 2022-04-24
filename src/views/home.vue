<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header class="header">
        <div class="log">
          <img src="../assets/icon.png" alt="" />
        </div>
        <div class="user">
          <el-badge
            :is-dot="noticeCount > 0 ? true : false"
            class="notice"
            type="danger"
          >
            <el-icon size="6" color="#409eff">
              <bell></bell>
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon size="6" color="#409eff">
                <right />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱:{{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeMenu"
            background-color="#001529"
            text-color="#fff"
            router
            :collapse="isCollapse"
            class="nav-menu"
          >
            <TreeMenu :userMenu="userMenu"></TreeMenu>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main>
            <div class="nav-top">
              <div class="bread">
                <BreadCrumb> </BreadCrumb>
              </div>
            </div>
            <div class="wrapper">
              <!-- 主题内容 -->
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
//框架引入
import { ref, reactive, computed, onMounted, Ref } from "vue";
import { useStore } from "vuex";
import { Axios, AxiosResponse } from "axios";
import { Bell, Right } from "@element-plus/icons-vue";
//接口代码
import { notiveCount, getMenuList } from "../api";

// 组件引入
import TreeMenu from "../components/TreeMenu.vue";
import BreadCrumb from "../components/BreadCrumb.vue";
import { ElMessage } from "element-plus";

const store = useStore();

onMounted(() => {
  getNoticeCount();
  getMenu();
});

const isCollapse = ref(false);
//获取用户信息
const userInfo = computed(() => {
  return store.state.userInfo;
});
//通知数量
let noticeCount: Ref = ref(0);
//左侧菜单列表
let userMenu: Ref = ref(null);
//当前高亮列表项
let activeMenu: Ref = ref(location.hash.slice(1));

//个人信息选项
const handleLogout = (command: string | number | object) => {
  ElMessage(`click on item${command}`);
};

//获取通知数量
const getNoticeCount = async () => {
  try {
    const res: AxiosResponse = await notiveCount();
    noticeCount.value = res;
  } catch (error) {
    console.log(error);
  }
};
//获取左侧列表
const getMenu = async () => {
  try {
    const list: AxiosResponse = await getMenuList();
    userMenu.value = list;
  } catch (error) {
    console.log(error);
  }
};
</script>

<style lang="scss">
.header {
  .user {
    display: flex;
    align-items: center;

    .el-dropdown {
      margin-left: 15px;

      .user-link {
        color: #409eff;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
}

.common-layout {
  height: 100vh;

  .el-header {
    background-color: #001529;
    height: 60px;
    display: flex;
    justify-content: space-between;

    .log {
      height: 100%;
      width: 60px;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        height: 80%;
        width: 80%;
      }
    }
  }

  .el-aside {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transform: width 0.5s;
  }

  .el-main {
    margin-left: 200px;
    padding: 0;
    padding-left: 0;
    padding-right: 0;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .bread {
        display: flex;
        align-items: center;
      }
    }

    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      // 表头 面包屑高度 面包屑pad  main pad
      height: calc(100vh - 60px - 51px - 40px);
    }
  }
}
</style>
