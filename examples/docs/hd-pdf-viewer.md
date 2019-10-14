## PDFViewer PDF阅读器

基于pdf.js

#### 功能实现
- 本地文件预览
- 线上文件预览
- 上一页/下一页切换
- 页码显示

### 本地pdf文件预览
:::demo
```html
<template>
  <div>
    选择pdf文件进行预览：
    <input ref="file" type="file" id="pdf-file" name="pdf" accept="application/pdf" @change="onPdfUpload" />
    <hd-pdf-viewer ref="pdfViewer"></hd-pdf-viewer>
  </div>
</template>

<script>
export default {
  methods: {
    onPdfUpload() {
      const file = this.$refs.file.files[0]
      this.$refs.pdfViewer.openDoc(URL.createObjectURL(file))
    }
  }
}
</script>
```
:::

### 在线pdf文件预览
::: demo 预览线上文件需要跨域
```html
<template>
  <div>
    <el-input style="margin-bottom: 10px;" placeholder="请输入pdf地址" size="mini" v-model="onlinePdfUrl"></el-input>
    <el-button size="mini" type="primary" @click="viewOnlinePdf">预线上览文件</el-button>
    <hd-pdf-viewer ref="pdfViewer"></hd-pdf-viewer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      onlinePdfUrl: ''
    }
  },
  methods: {
    viewOnlinePdf() {
      this.$refs.pdfViewer.openDoc(this.onlinePdfUrl)
    }
  }
}
</script>
```
:::


### Attributes
|      参数     |    说明   |   类型  | 可选值 | 默认值 |
|---------------|---------|---------|--------|--------|
| showLoading | 渲染页面时是否需要显示loading效果 | Boolean | — | false |

### Methods
| 方法名 |	说明 |	参数 |
|---------------|---------|---------|
| openDoc |	打开文档 | pdfUrl（pdf地址） |
| closeDoc |	关闭文档 | — |