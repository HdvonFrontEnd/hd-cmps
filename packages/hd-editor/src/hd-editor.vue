<template>
  <editor ref="editor" class="editor" :init="editorInit" v-model="localValue" :id="id"></editor>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Emit } from 'vue-property-decorator'
// 核心
import * as tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver/theme'
// 插件
import 'tinymce/plugins/table'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/autoresize'
import placeholderPlugin from './helper/placeholder'
tinymce.PluginManager.add('placeholder', placeholderPlugin)
// vue组件
import Editor from '@tinymce/tinymce-vue'
// 样式
import 'tinymce/skins/ui/oxide/skin.min.css'
import { CONTENT_STYLE } from './config/contentStyle.js'
// 语言包
import './config/zh_CN'
// 其他utils
import { genUUID } from 'src/utils/utils.js'

@Component({
  name: 'hd-editor',
  components: {
    Editor
  }
})
export default class HdEditor extends HdCmpsComponent {
  // ==================== Props ====================
  // 输入值
  @Prop({ type: String, default: '<p>defualt text</p><p>默认文字</p>' }) value: string
  // 文本框宽
  @Prop({ type: [Number, String], default: '100%' }) width: number | string
  // 文本框高
  @Prop({ type: [Number, String], default: '100%' }) height: number | string
  // 是否需要图片上传功能
  @Prop({ type: Boolean, default: true }) needImage: boolean
  // 是否需要高度随内容自适应
  @Prop({ type: Boolean, default: true }) autoResize: boolean
  // 是否需要高度随内容自适应
  @Prop({ type: Number, default: 500 }) maxHeight: number
  // 最小高度
  @Prop({ type: Number }) minHeight: number
  // 可选图片地址
  @Prop({ type: Array, default: () => ([]) }) imageList: []
  // 图片上传回调方法
  @Prop({ type: Function, default: () => {} }) uploadFun: () => {}
  // 是否需要去掉底部空白
  @Prop({ type: Boolean, default: false }) needTrim: boolean
  // placeholder
  @Prop({ type: String, default: '' }) placeholder: string

  // ==================== Emit ====================
  @Emit('input')
  onEmitInput(val) {
    return val
  }

  // ==================== Computed ====================
  get localValue(): string {
    return this.value
  }
  set localValue(val) {
    this.onEmitInput(val)
  }

  // ==================== Data ====================
  id = `hd-editor-${genUUID()}`
  editorInit = {
    convert_urls: false, // 阻止tinyMCE修改url
    skin: false, // 阻止tinyMCE从外部引入皮肤样式文件
    content_css: false, // 阻止tinyMCE从外部引入内容样式文件
    content_style: CONTENT_STYLE,
    language: 'zh_CN', // 语言包名
    plugins: `table ${this.needImage ? 'image' : ''} link placeholder lists ${this.autoResize ? 'autoresize' : ''}`, // 插件
    width: this.width, // 宽
    height: this.height, // 高
    max_height: this.maxHeight, // 最大高度（autoResize时有用）
    min_height: this.minHeight, // 最小高度（autoResize时有用）
    menubar: '', // 菜单栏设置
    toolbar: `undo redo | styleselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link ${this.needImage ? 'image' : ''}`, // 工具栏设置
    image_list: this.imageList.length > 0 ? this.imageList : null,
    // images_upload_url: this.imageUploadUrl,
    branding: false, // 是否显示‘power by tinyMCE’字样
    statusbar: false, // 是否显示状态栏，包含当前格式等信息。此外如果需要resize功能，则需要状态栏。
    images_upload_handler: this.uploadFun,
    init_instance_callback: this.trimDefaultHeight,
    placeholder: this.placeholder // placeholder
  }

  // ==================== 生命周期 ====================
  public created(): void {
    tinymce.init({})
  }

  // ==================== Methods ====================
  /**
   * 清空文本框
   */
  reset(): void {
    this.localValue = ''
  }
  /**
   * 获取焦点
   */
  focus(): void {
    const instance = tinymce.get(this.id)
    instance.focus()
  }
  /**
   * 在初始化后去除多余底部高度
   */
  trimDefaultHeight(): void {
    if (!this.needTrim) return
    const wrapper = (this.$refs.editor as this).$el.nextSibling as HTMLDivElement
    if (wrapper) {
      const height = wrapper.style.height ? wrapper.style.height.slice(0, -2) : 0
      wrapper.style.height = `${Number(height) - 50}px`
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  /*无用样式，仅仅是用来生成css文件，避免按需引入出错*/
  .editor {
    width: 100%;
    height: 100%;
  }
</style>
