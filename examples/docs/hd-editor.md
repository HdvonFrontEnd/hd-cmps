## Editor 富文本输入框

基于tinyMCE

### 基本用法

:::demo Editor 富文本输入框配置，图片上传路径可通过uploadFun配置
```html
<template>
  <div class="hd-editor-example-wrapper">
    <div class="editor-wrapper" style="margin-bottom: 20px;">
      <hd-editor v-model="inputValue" :max-height="400" ref="editor"></hd-editor>
    </div>
    <el-button @click="reset" size="mini">清空文本框</el-button>
    <el-button @click="focus" size="mini">获得焦点</el-button>
    <h4>输入结果（通过v-model绑定）：</h4>
    <div>{{inputValue}}</div>
  </div>
</template>

<script>
export default {
  name: 'hd-editor-example',
  data() {
    return {
      inputValue: '<p>富文本编辑器 测试文字</p>'
    }
  },
  methods: {
    reset() {
      this.$refs.editor.reset()
    },
    focus() {
      this.$refs.editor.focus()
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |                                           说明                                          |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------------------------------------------|---------|--------|--------|
| value        | 文本框内容 | String |  ——      | <p>defualt text</p><p>默认文字</p> |
| width        | 文本框宽度，如果是一个数字，那么会当成像素数来处理。如果是一个字符串，会将其直接设置为width的值。所以100与'100px'等价 | Number/String |   ——    | '100%' |
| height | 文本框高度，同width | Number/String | ——     | '100%' |
| imageList        | 备选图片列表 | Array   | ——     | ——     |
| placeholder        | placeholder | String | ——     | ——       |
| maxHeight        | 文本框最大高度，autoResize时有用 | Number/String | ——     | 500       |
| minHeight        | 文本框最小高度，autoResize时有用 | Number/String | ——     | ——       |
| autoResize        | 是否需要高度随内容自适应 | Boolean | ——     | true      |
| needImage        | 是否需要图片上传功能 | Boolean | ——     | true      |
| needTrim        | 是否需要去掉底部空白 | Boolean | ——     | false      |
| uploadFun        | 图片上传方法 | Function | ——     | ——      |

### Methods
|     方法名     |   说明   |  参数  |
|---------|--------------|-----|
| reset | 对该富文本输入框进行重置  | - |
| focus | 对该富文本输入框进行聚焦 | - |