<template>
  <transition name="el-fade-in">
    <div class="hd-pdf-viewer-wrapper" v-if="showDoc">
      <!--黑色遮罩-->
      <div class="backdrop" @click="closeDoc" title="点击退出文档"></div>
      <!--文档渲染容器-->
      <div class="pdf-viewer-page">
        <canvas ref="canvas"></canvas>
      </div>
      <div class="pdf-viewer-tool" ref="tool">
        <span class="arrow-button el-icon-arrow-left" @click="$_changePage('pre')"></span>
        <span class="current-page">{{currentPageIndex}} / {{totalPageNum}}</span>
        <span class="arrow-button el-icon-arrow-right" @click="$_changePage('next')"></span>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { Loading } from 'element-ui'
const PDFJS = require('pdfjs-dist')
PDFJS.GlobalWorkerOptions.workerSrc = './node_modules/pdfjs-dist/build/pdf.worker.js'
import { LoadingServiceOptions, ElLoadingComponent } from 'element-ui/types/loading' //eslint-disable-line
import { PdfViewer } from './models/index' //eslint-disable-line

@Component({
  name: 'hd-pdf-viewer'
})
export default class HdPdfViewer extends HdCmpsComponent {
  // ==================== Props ====================
  // 渲染页面时是否需要显示loading效果
  @Prop({ type: Boolean, default: false }) showLoading: boolean

  // ==================== Data ====================
  showDoc = false
  pdf: PdfViewer | null
  totalPageNum = 1
  currentPageIndex = 1
  pageChangeLocking = false
  scale = 1
  loading: ElLoadingComponent

  // ==================== Watch ====================
  @Watch('pageChangeLocking')
  onPageChangeLockingChanged(newVal): void {
    if (newVal) {
      const options: LoadingServiceOptions = {
        target: this.$refs.tool as HTMLElement,
        spinner: 'el-icon-loading',
        background: 'rgba(0,0,0,0.8)',
        customClass: 'loading'
      }
      if (this.showLoading) {
        this.loading = Loading.service(options)
      }
    } else {
      this.loading && this.loading.close()
    }
  }

  // ==================== Methods ====================
  /**
   * 打开文档
   * @param pdfUrl pdf地址
   */
  async openDoc(pdfUrl) {
    this.showDoc = true
    if (!pdfUrl) return Promise.reject('pdf 不存在')
    // 如果上一次切换页面操作尚未完成则不执行本次操作
    if (this.pageChangeLocking) return Promise.reject('上一次页面切换尚未完成')
    const pdf = await PDFJS.getDocument(pdfUrl)
    this.totalPageNum = pdf._pdfInfo.numPages
    this.pdf = pdf
    await this.renderPage(1)
  }
  /**
   * 关闭文档
   */
  closeDoc() {
    this.showDoc = false
    this.$_reset()
  }
  $_reset() {
    this.pdf = null
    this.totalPageNum = 1
    this.currentPageIndex = 1
    this.pageChangeLocking = false
    this.scale = 1
  }
  /**
   * 切换页码
   * @param direction 方向
   */
  async $_changePage(direction) {
    // 如果上一次切换页面操作尚未完成则不执行本次操作
    if (this.pageChangeLocking) return Promise.reject('上一次页面切换尚未完成')
    if (direction === 'next') {
      if (this.currentPageIndex + 1 <= this.totalPageNum) {
        await this.renderPage(++this.currentPageIndex)
      }
    } else if (direction === 'pre') {
      if (this.currentPageIndex - 1 >= 1) {
        await this.renderPage(--this.currentPageIndex)
      }
    }
  }
  /**
   * 渲染文档的某一页
   * @param pageIndex
   */
  async renderPage(pageIndex) {
    if (!this.pdf) return Promise.reject()
    const page = await this.pdf.getPage(pageIndex)
    const viewport = page.getViewport(this.scale)
    const canvas = this.$refs.canvas as HTMLCanvasElement
    const context = canvas.getContext('2d')
    canvas.width = viewport.width
    canvas.height = viewport.height
    this.pageChangeLocking = true
    await page.render({
      canvasContext: context,
      viewport: viewport
    }).promise
    this.pageChangeLocking = false
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  $tool-color: #fff;
  .hd-pdf-viewer-wrapper {
    .backdrop {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0,0,0,1);
      z-index: 8888;
      cursor: pointer;
    }
    .pdf-viewer-page {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 8889;
    }
    .pdf-viewer-tool {
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #474747;
      width: 100%;
      height: 32px;
      z-index: 8889;
      .current-page {
        min-width: 80px;
        text-align: center;
        color: $tool-color;
        margin: 0 20px;
      }
      .arrow-button {
        color: $tool-color;
        cursor: pointer;
        &:hover {
          color: darken($tool-color, 30%);
        }
      }
    }

  }
</style>
<style ref="stylesheet/scss" lang="scss">
  $tool-color: #fff;
  .hd-pdf-viewer-wrapper {
    .loading {
      .el-loading-spinner {
        top: 100%;
        i {
          color: darken($tool-color, 30%);
        }
      }
   }
  }
</style>
