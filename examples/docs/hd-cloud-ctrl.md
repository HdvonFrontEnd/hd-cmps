## 云台控制组件

云台控制组件

### 基础用法
:::demo 基础用法 
```html
<template>
  <hd-cloud-ctrl
    style="width: 200px;height: 200px"
    homeIcon="el-icon-refresh"
    @arrowMouseDown="onArrowMouseDown"
    @arrowMouseUp="onArrowMouseUp"
    @homeClick="onHomeClick"
  ></hd-cloud-ctrl>
</template>

<script>
export default {
  name: 'hd-cloud-ctrl-example',
  methods: {
    onHomeClick() {
      this.$message.success('点击复位按钮')
    },
    onArrowMouseDown(direction) {
      this.$message.success(`按下箭头按钮:${direction}`)
    },
    onArrowMouseUp(direction) {
      this.$message.success(`松开箭头按钮:${direction}`)
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |                        说明                         |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------|---------|--------|--------|
| arrowNum        | 箭头数量                                          | Number  |        |  8  |
| arrowIcon        | 箭头图标                                         | String  | ——   |   el-icon-arrow-down  |
| homeIcon        | 复位键图标                                        | String  | ——   |    |


### Methods
|      参数     |                                           说明                                      | 
|---------------|-------------------------------------------------------------------------------------|
| arrowMouseDown | 复位按钮点击的回调                                                         | 
| arrowMouseUp  | 按下箭头的回调                                                       | 
| homeClick    | 松开箭头的回调                                                         | 

