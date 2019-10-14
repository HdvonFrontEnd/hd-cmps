<template>
  <el-upload
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-button
      v-bind="$attrs"
      v-on="$listeners"
      type="primary">点击上传</el-button>
  </el-upload>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'BaseUpload'
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
</style>
