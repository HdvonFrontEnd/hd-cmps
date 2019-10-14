<template>
  <div ref="container" class="hd-progress-wrapper">
    <canvas id="progress" height="80"/>
    <canvas v-show="enableRangeSelect" id="cursor" height="80"/>
  </div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Watch } from 'vue-property-decorator'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import PerfectScrollbar from 'perfect-scrollbar'
import { formatTime, getCurrentTimeStamp } from 'src/utils/date'
import { ProgressConfig, TimeLine, BlockItem, PlayItem, HTMLCanvasExpand } from './models/index' //eslint-disable-line

// 默认配置
const defaultConfig: ProgressConfig = {
  count: 10,
  height: 80,
  width: 0,
  // 刻度条配置
  scale: {
    length: 10,
    color: '#ffffff',
    fontSize: 12, // 刻度对应的文字大小
    fontFamily: '微软雅黑',
    offset: 10, // 刻度偏移量
    timeline: {
      color: '#8c2907'
    },
    // 刻度线
    line: {
      large: { top: 40, height: 40 },
      middle: { top: 50, height: 30 },
      small: { top: 60, height: 20 }
    },
    // 遮罩块
    block: {
      top: 35,
      height: 45,
      color: 'rgba(24, 144, 255, .5)'
    }
  },
  // 选择器配置
  range: {
    width: 16,
    color: '#ff5959',
    fill: 'rgba(14, 51, 91, .6) '
  },
  // 滚动条配置
  scrollBar: {
    minScrollbarLength: 200,
    suppressScrollY: true,
    swipeEasing: true
  }
}

@Component({
  name: 'hd-progress'
})
export default class HdProgress extends HdCmpsComponent {
  // canvas配置
  @Prop({ type: Object, default: () => ({}) }) config: object
  // 刻度的开始时间
  @Prop({ type: Number, default: getCurrentTimeStamp() - 24 * 60 * 60 * 1000 }) startTime: number
  // 刻度的结束时间
  @Prop({ type: Number, default: getCurrentTimeStamp() }) endTime: number // 24小时
  // 播放列表
  @Prop({ type: Array, default: () => ([]) }) playList: PlayItem[]
  // 当前播放进度
  @Prop({ type: Number, default: 0 }) currentTime: number
  // 刻度放大倍数
  @Prop({ type: Number, default: 10 }) zoom: number
  // 如果是启动浮标选择
  @Prop({ type: Boolean, default: false }) enableRangeSelect: boolean

  // data 管理
  scaleCanvas: HTMLCanvasExpand // 刻度canvas
  scaleCtx: CanvasRenderingContext2D // 刻度canvas上下文
  cursorCanvas: HTMLCanvasExpand // 浮标canvas
  cursorCtx: CanvasRenderingContext2D // 浮标 canvas上下文
  pxPerMs = 0 // 每毫秒/像素
  scaleNum = 0 // 刻度总数
  totalWidth = 0 // 刻度总宽度
  blockList: BlockItem[] // 时间块列表
  timeLine: TimeLine = { x: 0, y: 0, time: 0 } // 时间线
  cursorList: TimeLine[] // 开始/结束浮标的配置
  currentIndex = 0 // 当前移动浮标的角标
  maxWidth = 0 // 浮标的最大宽度
  lastMove = 0 // 鼠标最后出现位置
  scrollWidth = 0 // 滚动条宽度
  scrollBar: PerfectScrollbar // 滚动条
  canvasConf: ProgressConfig = this.getConfig() // canvas config

  // computed 管理
  get getScrollWidth(): number {
    return this.scrollWidth
  }

  // watch 管理
  @Watch('currentTime') // 当前时间改变
  onCurrentTimeChanged(nVal): void {
    this.bindEvent({ offsetX: Math.floor((nVal - this.startTime) * this.pxPerMs), offsetY: 40 }, true)
  }
  @Watch('zoom') // 缩放基数改变
  onZoomChanged(nVal): void {
    this.updateScaleAndWidth(nVal)
    if (this.scrollBar) {
      this.scrollBar.update()
    }
    this.updatePxPerMs()
    this.restDraw()
    this.restStoreHistoey()
  }
  @Watch('enableRangeSelect') // 开启选择刻度范围状态
  onEnableRangeSelectChanged(nVal): void {
    if (nVal) {
      this.restDrawCursor()
    }
  }
  @Watch('playList', { deep: true }) // 播放列表改变
  onPlayListChanged(): void {
    if (this.scaleCtx) {
      this.updatePxPerMs()
      this.restDraw()
    }
  }

  public mounted(): void {
    this.updateScaleAndWidth()
    this.initScale()
    this.$nextTick().then(() => {
      this.setupSrollbar()
    })
  }

  // method 管理
  // 合并canvas配置
  getConfig(): ProgressConfig {
    const config: ProgressConfig = Object.assign(defaultConfig, this.config)
    this.scaleNum = config.count / this.zoom
    return config
  }
  // 启用滚动条
  setupSrollbar(): void {
    this.scrollBar = new PerfectScrollbar('.hd-progress-wrapper', {
      minScrollbarLength: 200,
      suppressScrollY: true,
      swipeEasing: true
    })
  }
  // 更新刻度数量和总长度
  updateScaleAndWidth(val = this.zoom): void {
    this.scaleNum = this.canvasConf.count * val
    this.totalWidth = this.scaleNum * 10
  }
  // 初始化canvas
  initCanvas(tag, canvas, ctx): void {
    const cv = document.getElementById(tag) as HTMLCanvasElement
    this[canvas] = cv
    this[canvas].height = this.canvasConf.height
    this[ctx] = cv.getContext('2d') as CanvasRenderingContext2D
  }
  // 初始化刻度条canvas
  initScale(): void {
    if (this.scaleCtx) return
    this.initCanvas('progress', 'scaleCanvas', 'scaleCtx')
    this.scaleCanvas.width = this.totalWidth
    this.restDraw()
    this.initCursor()
  }
  // 重绘刻度条
  restDraw(): void {
    this.scaleCtx.clearRect(0, 0, this.scaleCanvas.width, this.scaleCanvas.height)
    this.scaleCanvas.width = this.totalWidth
    this.scaleCtx.fillStyle = this.canvasConf.scale.color
    this.updatePxPerMs()
    this.drawScale()
    this.drawScaleText()
    this.drawBlock()
  }
  // 初始化浮标canvas
  initCursor(): void {
    if (this.cursorCtx) return
    this.initCanvas('cursor', 'cursorCanvas', 'cursorCtx')
    this.restDrawCursor()
  }
  // 重绘浮标
  restDrawCursor(width = 3): void {
    this.cursorCanvas.width = width
    this.drawCursor()
    this.mouseCursorEvent()
  }
  // 计算每毫秒对应的像素
  updatePxPerMs(): void {
    this.pxPerMs = this.totalWidth / (this.endTime - this.startTime)
  }
  // 画刻度
  drawScale(): void {
    this.scaleCtx.font = `${this.canvasConf.scale.fontSize}px ${this.canvasConf.scale.fontFamily}`
    const scaleLength = this.canvasConf.scale.length
    for (let i = 0; i < this.scaleNum; i++) {
      for (let j = 0; j < scaleLength; j++) {
        const offset = (i * scaleLength * this.canvasConf.scale.offset) + j * this.canvasConf.scale.offset
        const index = (i * scaleLength + j)
        if (index % 10 === 0 || (i === this.scaleNum - 1 && j === scaleLength - 1)) {
          // 当刻度整除10，画最长的刻度
          this.scaleCtx.fillRect(offset, this.canvasConf.scale.line.large.top, 2, this.canvasConf.scale.line.large.height)
        } else if (index % 5 === 0) {
          // 当刻度整除5，画中长的刻度
          this.scaleCtx.fillRect(offset, this.canvasConf.scale.line.middle.top, 2, this.canvasConf.scale.line.middle.height)
        } else {
          // 画小刻度
          this.scaleCtx.fillRect(offset, this.canvasConf.scale.line.small.top, 2, this.canvasConf.scale.line.small.height)
        }
      }
    }
  }
  // 画刻度对应的文字
  drawScaleText(): void {
    const timeRange = this.endTime - this.startTime
    const timeSingle = Math.floor(timeRange / this.scaleNum)
    let offset = 0
    for (let i = 0; i <= this.scaleNum; i++) {
      offset = i ? i * timeSingle * this.pxPerMs - ((this.canvasConf.scale.fontSize * 4) / 2 - 1) : i
      if (i >= this.scaleNum) {
        offset = i * timeSingle * this.pxPerMs - (this.canvasConf.scale.fontSize * 4) - 1
      }
      if (i % 10 === 0) {
        this.scaleCtx.fillText(formatTime(new Date(this.startTime + i * timeSingle), 'hh:mm:ss'), offset, 30)
      }
    }
  }
  // 画时间块
  drawBlock(): void {
    this.scaleCtx.fillStyle = this.canvasConf.scale.block.color
    this.blockList = []
    for (let i = 0; i < this.playList.length; i++) {
      const offset = (this.playList[i].startTimestamp - this.startTime) * this.pxPerMs
      const width = (this.playList[i].endTimestamp - this.playList[i].startTimestamp) * this.pxPerMs
      this.scaleCtx.fillRect(offset, this.canvasConf.scale.block.top, width, this.canvasConf.scale.block.height)
      this.blockList.push({ x: offset, y: this.canvasConf.scale.block.top, w: width, h: this.canvasConf.scale.block.height })
    }
    this.watchEvents()
  }
  // 重绘历史操作
  restStoreHistoey(): void {
    // 判断是否存在之前选择过的时间线，如果存在，则根据时间点定位到放大后的刻度上
    if (this.timeLine.t) {
      this.timeLine.x = (this.timeLine.t - this.startTime) * this.pxPerMs
      this.drawTimeLine()
    }
    if (this.cursorList[1].x > 0) {
      this.cursorList.map((_, index) => {
        _.x = (_.time - this.startTime) * this.pxPerMs
        _.x = index ? _.x + this.canvasConf.range.width : _.x
      })
      this.rendering(this.restMove)
    }
    this.lastMove && this.drawDateTimeText((this.lastMove - this.startTime) * this.pxPerMs)
  }
  // 判断边界
  checkBoundary(x, y, el): boolean {
    return x >= el.x && x < (el.x + el.w) && y > el.y && y < (el.y + el.h)
  }
  // 监听事件
  watchEvents(): void {
    this.scaleCanvas.removeEventListener('click', this.bindEvent)
    this.scaleCanvas.removeEventListener('mousemove', this.bindEvent)
    this.scaleCanvas.addEventListener('click', this.bindEvent)
    this.scaleCanvas.addEventListener('mousemove', this.bindEvent)
  }
  // 对时间块绑定事件
  bindEvent(e, isAuto = false): void {
    const x = e.offsetX
    const y = e.offsetY
    this.blockList.forEach(_ => {
      if (this.checkBoundary(x, y, _)) {
        this.scaleCtx.clearRect(0, 0, this.scaleCanvas.width, this.scaleCanvas.height)
        this.restDraw()
        if (e.type === 'mousemove') {
          // 鼠标移到时间快区域，鼠标定位对应的时间，显示在顶部
          if (this.timeLine) {
            this.drawTimeLine()
          }
          this.drawDateTimeText(x)
        } else {
          // 点击画时间线事件
          this.timeLine = { x, y, time: 0 }
          this.drawTimeLine(!isAuto)
          !isAuto && this.drawDateTimeText(x)
        }
      }
    })
  }
  // 画移动鼠标对应的文字
  drawDateTimeText(x): void {
    const time = Math.floor(x / this.pxPerMs + this.startTime)
    this.lastMove = time
    this.scaleCtx.fillStyle = '#fff'
    this.scaleCtx.fillText(formatTime(new Date(time), 'yyyy-MM-dd hh:mm:ss'), x - ((this.canvasConf.scale.fontSize * 10) / 2 - 1), 10)
  }
  /**
   * 点击定位时间线
   * @param {Boolean} isClick 是否来自点击事件操作
   */
  drawTimeLine(isClick?: boolean): void {
    const time = Math.floor(this.timeLine.x / this.pxPerMs + this.startTime)
    this.scaleCtx.fillStyle = this.canvasConf.scale.timeline.color
    this.timeLine.t = time
    this.scaleCtx.fillRect(this.timeLine.x, 0, 2, this.canvasConf.height)
    isClick && this.$emit('seekTo', this.timeLine.t)
  }
  // 画浮标
  drawCursor(x = -12): void {
    this.cursorCtx.fillStyle = '#ff5959'
    this.cursorList = []
    this.cursorList.push({ x: 0, y: 0, w: this.canvasConf.range.width, h: this.canvasConf.height, t: 'left', time: this.startTime })
    this.cursorList.push({ x: 0, y: 0, w: this.canvasConf.range.width, h: this.canvasConf.height, t: 'right', time: this.startTime })
    this.moveRight()
  }
  // 重新画
  restMove(): void {
    this.cursorCanvas.width = this.maxWidth
    this.drawMoveArea()
    this.cursorCtx.fillStyle = '#ff5959'
    this.moveLeft(this.cursorList[0].x)
    this.moveRight(this.cursorList[1].x)
  }
  // 左边浮标移动
  moveLeft(x = 0): void {
    this.scaleCtx.beginPath()
    this.cursorCtx.moveTo(x, 0)
    this.cursorCtx.lineTo(x, this.canvasConf.height)
    this.cursorCtx.lineTo(3 + x, this.canvasConf.height)
    this.cursorCtx.lineTo(3 + x, 10)
    this.cursorCtx.lineTo(this.canvasConf.range.width + 2 + x, 10)
    this.cursorCtx.closePath()
    this.cursorCtx.fill()
  }
  // 游标浮标移动
  moveRight(x = -12): void {
    this.maxWidth = 16 + x
    this.cursorCtx.beginPath()
    this.cursorCtx.moveTo(15 + x, 0)
    this.cursorCtx.lineTo(0 + x, 10)
    this.cursorCtx.lineTo(12 + x, 10)
    this.cursorCtx.lineTo(12 + x, this.canvasConf.height)
    this.cursorCtx.lineTo(15 + x, this.canvasConf.height)
    this.cursorCtx.closePath()
    this.cursorCtx.fill()
    if (this.cursorList[1].x > this.canvasConf.range.width && this.cursorList[0].x <= 0) {
      this.moveLeft()
    }
  }
  // 画浮标之间的区域
  drawMoveArea(): void {
    this.cursorCtx.fillStyle = this.canvasConf.range.fill
    this.cursorCtx.fillRect(this.cursorList[0].x, 0, this.cursorList[1].x - this.cursorList[0].x + this.canvasConf.range.width, this.canvasConf.height)
  }
  // 浮标事件
  mouseCursorEvent(): void {
    document.removeEventListener('mouseup', this.mouseUp)
    this.cursorCanvas.removeEventListener('mousedown', this.mouseDown)
    this.cursorCanvas.addEventListener('mousedown', this.mouseDown)
  }
  // 鼠标点击选中区事件
  mouseDown(e): void {
    const x = e.offsetX
    const y = e.offsetY
    if (this.cursorCanvas.setCapture) this.cursorCanvas.setCapture()
    this.cursorList.forEach(_ => {
      if (this.checkBoundary(x, y, _)) {
        if (_.x <= 0 || _.t === 'right') {
          this.currentIndex = 1
        }
        if (_.t === 'left') {
          this.currentIndex = 0
        }
        document.addEventListener('mousemove', this.mouseMove)
        document.addEventListener('mouseup', this.mouseUp)
      }
    })
  }
  // 浮标移动
  mouseMove(e): void {
    if (this.currentIndex && e.offsetX + 13 <= this.cursorList[0].x) return
    if (!this.currentIndex && e.offsetX - 12 >= this.cursorList[1].x) return
    this.cursorList[this.currentIndex].x = e.offsetX <= 0 ? -12 : e.offsetX
    const time = Math.floor(this.cursorList[this.currentIndex].x / this.pxPerMs + this.startTime)
    this.cursorList[this.currentIndex].time = time
    this.rendering(this.restMove)
  }
  // 移动放开
  mouseUp(e): void {
    this.$emit('timeRangChange', { startTime: this.cursorList[0].time, endTime: this.cursorList[1].time })
    document.removeEventListener('mousemove', this.mouseMove)
    if (this.cursorCanvas.releaseCapture) this.cursorCanvas.releaseCapture()
  }
  // 渲染动画
  rendering(cb): void {
    // const raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame
    const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame
    raf(cb)
  }
  // setScrollOffset() {
  //   const sbx = document.querySelector('.ps__scrollbar-x')
  //   if (!sbx) return
  //   const count = sbx.style.left.replace('px', '')
  //   sbx.style.left = `${(parseInt(count) + 10)}px`
  // }
}
</script>

<style ref="stylesheet/scss" lang="scss">
.hd-progress-wrapper {
  position: relative;
  width: 100%;
  background-color: #1c1c1c;
  #progress {
    cursor: pointer;
  }
  #cursor {
    position: absolute;
    left: 0;
    top: 0;
  }
  .ps__rail-y, .ps__rail-x {
    z-index: 2;
    background-color: #1c1c1c !important;
    opacity: 1 !important;
  }
  .ps__rail-y {
    width: 12px !important;
  }
  .ps__rail-x {
    height: 12px !important;
  }
  .ps__thumb-y, .ps__thumb-x {
    z-index: 2;
    opacity: 1 !important;
    background-color: #4e4e4e;
  }
  .ps__thumb-y {
    width: 10px !important;
    right: 1px !important;
  }
  .ps__thumb-x {
    height: 10px !important;
  }
}
</style>
