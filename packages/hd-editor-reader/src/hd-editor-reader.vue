<template>
  <div :class="['reader-wrapper', border ? '' : 'no-border']">
    <!--使用timy-mce实现的阅读器-->
    <!--<reader-->
      <!--v-bind="$attrs"-->
      <!--&gt;</reader>-->
    <!--使用v-html实现的简单阅读器-->
    <reader-simple  v-bind="$attrs"></reader-simple>
  </div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop } from 'vue-property-decorator'
import Reader from './cmps/reader.vue'
import ReaderSimple from './cmps/reader-simple.vue'

@Component({
  name: 'hd-editor-reader',
  components: {
    Reader,
    ReaderSimple
  }
})
export default class HdEditorReader extends HdCmpsComponent {
  // 是否需要边框
  @Prop({ type: Boolean, default: false }) border: boolean
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  /*无用样式，仅仅是用来生成css文件，避免按需引入出错*/
  .reader-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
<style ref="stylesheet/scss" lang="scss">
  .reader-wrapper.no-border {
    .tox-tinymce {
      border: 0;
    }
  }
</style>
