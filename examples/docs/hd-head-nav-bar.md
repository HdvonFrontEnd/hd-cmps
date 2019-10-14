## HeadNavBar 头部导航栏

### 基本用法
authMenu 配置
- authKey对应路由的名称
- 菜单名，优先级比前端的路由定义的高
::: demo 一般情况下会在开发者模式下展现无权限路由，设置`debug`为process.env.NODE_ENV === 'development'
```html
<template>
  <div class="hd-head-nav-bar-example-wrapper">
    <div style="margin: 20px auto; background: #00173C; width:1000px">
      <hd-head-nav-bar
        ref="mynav"
        background="#00aaff"
        :router="router"
        :authMenu="authMenu"
        :menuStyleMethod="menuStyleMethod"
        :debug="form.isAdmin"
        @menuClick="menuClick"
      ></hd-head-nav-bar>
    </div>
    <el-form ref="form" label-width style="clear:both">
      <el-form-item label="开发者模式">
        <el-radio :label="true" v-model="form.isAdmin" @change="onChange">是</el-radio>
        <el-radio :label="false" v-model="form.isAdmin" @change="onChange">否</el-radio>
      </el-form-item>
    </el-form>
    <h3 v-show="res">点击回调的数据</h3>
    <div v-show="res">{{res}}</div>
  </div>
</template>

<script>
export default {
  name: 'hd-head-nav-bar-example',
  data() {
    return {
      res: '',
      form: {
        isAdmin: true
      },
      authMenu: {
        menu2: {
          name: '服务器菜单名称1' // 不传则引用原始名称
        },
        menu3: {},
        menu4: {},
        menu5: {}
      },
      router: [
        {
          path: 'menu1',
          name: 'menu1',
          meta: {
            title: '一级菜单1',
            icon: 'iconClass'
          }
        },
        {
          path: 'menu2',
          name: 'menu2',
          meta: { title: '一级菜单2' },
          children: [
            {
              path: 'menu3',
              name: 'menu3',
              meta: {
                title: '二级菜单1',
                icon: 'ico1'
              },
              children: [
                {
                  path: 'menu4',
                  name: 'menu4',
                  meta: {
                    title: '二级菜单1',
                    icon: 'ico1'
                  }
                },
                {
                  path: 'menu5',
                  name: 'menu5',
                  meta: { title: '二级菜单2' }
                },
                {
                  path: 'menu5',
                  name: 'menu5',
                  meta: { title: '二级菜单2' }
                },
                {
                  path: 'menu5',
                  name: 'menu5',
                  meta: { title: '二级菜单2' }
                },
                {
                  path: 'menu5',
                  name: 'menu5',
                  meta: { title: '二级菜单2' }
                }
              ]
            },
            {
              path: 'menu6',
              name: 'menu6',
              meta: { title: '二级菜单2' },
              children: [
                {
                  path: 'menu7',
                  name: 'menu7',
                  meta: {
                    title: '二级菜单1',
                    icon: 'ico1'
                  }
                }
              ]
            },
            {
              path: 'menu6',
              name: 'menu6',
              meta: { title: '二级菜单2' },
              children: [
                {
                  path: 'menu7',
                  name: 'menu7',
                  meta: {
                    title: '二级菜单1',
                    icon: 'ico1'
                  }
                }
              ]
            },
            {
              path: 'menu6',
              name: 'menu6',
              meta: { title: '二级菜单2' },
              children: [
                {
                  path: 'menu7',
                  name: 'menu7',
                  meta: {
                    title: '二级菜单1',
                    icon: 'ico1'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },

  computed: {
    mynav() {
      return JSON.stringify(this.$refs.mynav)
    }
  },
  methods: {
    onChange() {
      this.$refs.mynav.updateView()
    },
    menuClick(event, menuData, level) {
      this.res = { event, menuData, level }
    },
    menuStyleMethod(data, level) {
      const style = {}

      if (level === 0) {
        // 一级可点击菜单路由
        if (!data.children || data.children.length === 0) {
          style.cursor = 'pointer'
        }
      } else if (level === 2) { // 三级都可以点
        // 三级菜单
        style.cursor = 'pointer'
      }
      return style
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |    说明   |   类型  | 可选值 | 默认值 |
|---------------|---------|---------|--------|--------|
| router | 菜单数据，this.$router.options.routes | Array | —— | —— |
| authMenu | 权限数据 | Object | —— | —— |
| menuStyleMethod | 配置菜单样式 | Function | —— | —— |
| debug | 是否展示无权限路由，若无权限，则菜单会有红色x | Boolean | —— | —— |
| background | 配置下拉菜单背景颜色 | String | —— | —— |

### Events
| 事件名 |	说明 |	参数 |
|---------------|---------|---------|
| menuClick |	当用户手动点击菜单项时触发的事件 | event, menuData, level |

### Methods
| 方法名 |	说明 |	参数 |
|---------------|---------|---------|
| updateView |	更新菜单 | - |