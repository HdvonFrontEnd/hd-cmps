## EditorReader 富文本阅读器

使用v-html实现的简单阅读器，用于hd-editor的文本显示

### 基本用法

::: demo
```html
<template>
  <div class="hd-editor-reader-example-wrapper">
    <div class="editor-wrapper">
      <h4>请在此输入：</h4>
      <hd-editor v-model="value" :max_height="400" ref="editor"></hd-editor>
    </div>
    <div class="reader-wrapper">
      <h4>富文本阅读器</h4>
        <hd-editor-reader :value="value" ref="reader"></hd-editor-reader>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'hd-editor-reader-example',
    data() {
      return {
        value: '<p>富文本编辑器 测试文字</p>'
      }
    }
  }
</script>
```
:::

### Attributes
|      参数     |            说明        |   类型  | 可选值 | 默认值 |
|---------------|---------------------------------|---------|--------|--------|
| value / v-model        | 绑定值 | String / Number |  ——      | —— |