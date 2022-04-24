<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">MISSLV后台管理系统</div>
      <div class="desc">Vue3.2+TS+ElementPlus+Node+Mongo</div>
    </div>
    <div class="img"></div>
  </div>
</template>

<style lang="scss">
.welcome {
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  .content {
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }

    .title {
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }

    .desc {
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }

  .img {
    width: 371px;
    height: 438px;
    background-image: url("../assets/welcome.png");
    margin-left: 215px;
  }
}
</style>
<script lang="ts" setup></script>
