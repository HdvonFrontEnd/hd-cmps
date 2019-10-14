<template>
	<div class="home-wrapper page-container">
    <el-header class="home-header">
      <img src="../assets/images/hdLogo.png" class="home-header__logo">
      <div class="home-header__text" @click="NavToHome">HDVON</div>
    </el-header>
    <div class="home-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'home',
  methods: {
    NavToHome() {
      this.$router.push({ path: '/' })
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.home-wrapper {
    height: 100%;
    overflow: auto;
    margin: 0 auto;
    color: #444;
    .home-header {
      display: flex;
      align-items: center;
      font-size: 32px;
      border-bottom: 1px solid #dcdfe6;
      margin-bottom: 10px;
      .home-header__logo {
        width: 40px;
        height: 40px;
        margin-right: 20px;
      }
      .home-header__text {
        cursor: pointer;
      }
    }
    .home-content {
      height: calc(100% - 70px);
    }
	}
</style>
