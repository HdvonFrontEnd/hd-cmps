<template>
  <div class="navbar-menu-wrapper">
    <!-- 顶上那些菜单（一级菜单） -->
    <div :key="idx" v-for="(first,idx) in routerC">
      <div class="first" v-if="!first.hidden && getAuth(first.name)">
        <div :ref="idx" class="title">
          <div
            :class="{on:activeName === first.name}"
            :style="first | menuStyle(0,menuStyleMethod)"
            @click="$emit('menuClick',$event,first,0)"
            class="three"
          >
            <first-item :authMenu="authMenu" :item="first"></first-item>
          </div>
        </div>
        <div
          :style="{width:`${widths[idx] + 65}px`,background: background}"
          class="box"
          v-if="first.children"
        >
          <div style="padding: 30px;clear: both">
            <template v-for="(second,idx2) in first.children">
              <div
                :key="idx2"
                :ref="idx"
                class="second"
                v-if="!second.hidden && getAuth(second.name)"
              >
                <div
                  :style="second | menuStyle(1,menuStyleMethod)"
                  @click="$emit('menuClick',$event,second,1)"
                >
                  <tree-item :authMenu="authMenu" :item="second"></tree-item>
                </div>
                <template v-for="(three,idx3) in second.children">
                  <div
                    :key="idx3"
                    :style="three | menuStyle(2,menuStyleMethod)"
                    @click="$emit('menuClick',$event,three,2)"
                    v-if="second.children && !three.hidden && getAuth(three.name)"
                  >
                    <tree-item
                      :authMenu="authMenu"
                      :class="{on:activeName === three.name}"
                      :item="three"
                      class="three"
                    ></tree-item>
                  </div>
                </template>
              </div>
            </template>
            <div style="clear:both"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { HdCmpsComponent } from 'types/component'
  import { Component, Prop } from 'vue-property-decorator'
  import treeItem from './cmps/threeItem.vue'
  import firstItem from './cmps/firstItem.vue'
  import { RouterItem, HdRouter } from './models/index' // eslint-disable-line

  @Component({
    name: 'hd-head-nav-bar',
    components: { treeItem, firstItem },
    filters: {
      menuStyle(data, level, fun) {
        return fun ? fun(data, level) : {}
      }
    }
  })
  export default class HdHeadNavBar extends HdCmpsComponent {
    // ==================== Props ====================
    // 路由列表
    @Prop({ type: Array, default: () => ([]) }) router: RouterItem[]
    // 背景色
    @Prop({ type: String, default: '' }) background: string
    // 权限菜单
    @Prop({ type: Object }) authMenu: object
    // 是否开启调试
    @Prop({ type: Boolean, default: false }) debug: boolean
    // 菜单样式方法
    @Prop({ type: Function, default: () => {} }) menuStyleMethod: () => {}

    // ==================== Data ====================
    widths = []
    routerC = this.router.filter(v => !v.hidden)

    // ==================== Computed ====================
    get activeName(): string {
      return (this as HdRouter).$route.name
    }

    // ==================== 生命周期 ====================
    public mounted() {
      // 没有找到合适的更新时机，暂时以这种方式处理
      const timers: number[] = [0, 100, 200, 500, 1000]
      timers.forEach(v => this.updateView(v))
    }

    // ==================== Methods ====================
    // 获取已有权限的菜单
    getAuth(menuName) {
      if (!this.authMenu) return true
      return this.authMenu[menuName] || this.debug
    }
    // 更新菜单的style 需要排除隐藏的内容
    updateView(time = 100): void {
      // TODO: 定时器是用来处理什么问题？
      setTimeout(() => {
        const keys = Object.keys(this.$refs)
        keys.forEach(key => {
          const arr: number[] = []
          const doms = this.$refs[key] as HTMLDivElement[]
          doms.forEach((val, i) => {
            if (i === 0) return false
            const idx = i - 1
            const index = Math.floor(idx / 3)
            arr[index] = arr[index] || 0
            arr[index] += val.offsetWidth
          })
          this.$set(this.widths, key, Math.max(...arr))
        })
      }, time)
    }
  }
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  $height: 60px;
  $onColor: #1890ff;
  .el-icon-arrow-down {
    padding-left: 5px;
  }
  .navbar-menu-wrapper {
    white-space: nowrap;
    height: $height;
    .first {
      font-size: 16px;
      padding: 0 10px;
      margin: 0 12px;
      position: relative;
      line-height: $height;
      float: left;
      text-align: center;
      color: rgba(255, 255, 255, 0.65);
      &:hover {
        color: #fff;
        .box {
          max-height: 600px;
          // 解决过渡bug
          z-index: 10000;
        }
        .title {
          &:after {
            content: '';
            width: 4px;
            height: 26px;
            position: absolute;
            left: 0;
            top: 17px;
            background-color: #00378e;
          }
        }
      }
      .box {
        z-index: 9999;
        color: #fff;
        clear: both;
        text-align: left;
        position: absolute;
        top: $height;
        background: #00245f;
        left: 50%;
        transform: translateX(-50%);
        transition: max-height 0.5s;
        max-height: 0;
        overflow: hidden;
        z-index: 9999;
        .second {
          float: left;
          padding-bottom: 20px;
          padding-left: 30px;
          min-height: 1px;
          .three {
            padding-left: 20px;
            font-size: 14px;
            line-height: 38px;
            &.on {
              color: $onColor;
            }
            &:hover {
              color: $onColor;
            }
          }
          &:nth-child(3n + 1) {
            padding-left: 0;
            clear: both;
          }
        }
      }
    }
  }

  img {
    width: 20px;
    height: 20px;
    vertical-align: middle;
  }
</style>
