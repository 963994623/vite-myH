<template>
  <div class="common-layout">
    <el-container style="height: 100vh">
      <el-header>
        <div class="log"></div>
        <div class="user">用户</div>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-container>
          <el-main>
            <div class="nav-top">
              <div class="bread">面包学</div>

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



<style lang="scss">
.common-layout {
  height: 100vh;

  .el-header {
    background-color: black;
    height: 60px;
    display: flex;
    justify-content: space-between;
  }

  .el-aside {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transform: width .5s;
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