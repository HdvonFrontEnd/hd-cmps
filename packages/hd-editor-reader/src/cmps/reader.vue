<template>
  <tiny-mce ref="reader" class="reader" :init="readerInit" v-model="localValue" disabled></tiny-mce>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
// 核心
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
// 插件
import 'tinymce/plugins/autoresize'
// vue组件
import TinyMce from '@tinymce/tinymce-vue'
import { CONTENT_STYLE } from 'packages/hd-editor/src/config/contentStyle.js'
// 其他
import { isIE } from 'src/utils/utils.js'
@Component({
  name: 'reader',
  components: {
    TinyMce
  }
})
export default class Reader extends Vue {
  // ==================== Props ====================
  // 文字内容
  @Prop({ type: String, default: '' }) value: string
  // 文本框宽
  @Prop({ type: [Number, String], default: '100%' }) width: string | number
  // 文本框高
  @Prop({ type: [Number, String], default: '100%' }) height: string | number
  // 是否需要高度随内容自适应
  @Prop({ type: Boolean, default: true }) autoResize: boolean
  // 最大高度
  @Prop(Number) maxHeight: number
  // 最小高度
  @Prop(Number) minHeight: number
  // 是否需要去掉底部空白
  @Prop({ type: Boolean, default: true }) needTrim: boolean

  // ==================== Computed ====================
  get localValue(): string {
    return this.value
  }
  set localValue(val) {
  }

  // ==================== Data ====================
  readerInit = {
    skin: false, // 阻止tinyMCE从外部引入皮肤样式文件
    content_css: false, // 阻止tinyMCE从外部引入内容样式文件
    content_style: CONTENT_STYLE,
    menubar: '',
    toolbar: '',
    plugins: this.autoResize ? 'autoresize' : '',
    width: this.width, // 宽
    height: this.height, // 高
    max_height: this.maxHeight, // 最大高度（autoResize时有用）
    min_height: this.minHeight, // 最小高度（autoResize时有用）
    branding: false, // 是否显示‘power by tinyMCE’字样
    statusbar: false, // 是否显示状态栏，包含当前格式等信息。此外如果需要resize功能，则需要状态栏。
    init_instance_callback: this.trimDefaultHeight
  }

  // ==================== 生命周期 ====================
  public created() {
    tinymce.init({})
  }

  // ==================== Methods ====================
  /**
   * 在初始化后去除多余底部高度
   */
  trimDefaultHeight() {
    if (!this.needTrim) return
    const action = () => {
      const reader = this.$refs.reader as Vue
      const wrapper = reader.$el.nextSibling as HTMLElement
      if (wrapper.style.height !== null) {
        wrapper.style.height = `${Number(wrapper.style.height.slice(0, -2)) - 50}px`
      }
    }
    if (isIE()) {
      setTimeout(() => {
        action()
      }, 100)
    } else {
      action()
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .reader-wrapper {
  }
</style>
