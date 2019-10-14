<template>
  <div class="component-wrapper page-container">
    <el-row class="component-content-wrapper">
      <el-col :span="4" class="nav-list-wrapper">
        <el-scrollbar class="component__scrollbar" tag="div">
          <div :class="['nav-list-item', item.name === $route.name ? 'active' :'']" v-for="item in navList" :key="item.name" @click="navTo(item.name)">
            {{item.meta.name}}
          </div>
        </el-scrollbar>
      </el-col>
      <el-col :span="20" class="component-component-wrapper">
        <el-scrollbar class="component__scrollbar" tag="div">
          <router-view></router-view>
        </el-scrollbar>
      </el-col>
    </el-row>
    <el-backtop target=".component-component-wrapper .el-scrollbar__wrap" :right="100" :visibility-height="20"></el-backtop>
  </div>
</template>

<script>
import NavList from 'src/nav-list'
export default {
  name: 'home',
  data() {
    return {
      navList: NavList
    }
  },
  computed: {
    showEmptyText() {
      return this.$route.path === '/'
    }
  },
  methods: {
    navTo(routeName) {
      this.$router.push(routeName)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .component-wrapper {
    height: 100%;
    overflow: auto;
    margin: 0 auto;
    color: #444;
    .component-content-wrapper {
      height: 100%;
    }
    .nav-list-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      .nav-list-item {
        cursor: pointer;
        width: 100%;
        height: 40px;
        line-height: 40px;
        transition: .15s ease-out;
        &:hover,
        &.active {
          color: #409eff;
        }
      }
    }
    .component__scrollbar {
      height: 100%;
      /deep/ .el-scrollbar__view {
        height: 100%;
      }
      /deep/ .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .component-component-wrapper {
      height: 100%;
      .content {
        padding-bottom: 80px;
      }
    }
  }
</style>
