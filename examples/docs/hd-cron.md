## cron 表达式

cron 表达式

### 基础用法
:::demo 
```html
<template>
	<div class="hd-cron-example-wrapper">
    <el-alert
      title="可以直接输入表达式，也可以点击按钮弹出控件进行选择"
      type="success"></el-alert>
    <div style="margin-top: 20px; width: 300px">
      <hd-cron size="mini" v-model="result"></hd-cron>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      result: ''
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |                        说明                         |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------|---------|--------|--------|
| v-model        | 绑定的值                                          | String  |        |    |

