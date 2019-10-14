/**
 * 视频播放组件通用的部分
 * update:
 * 需要注意，使用了ts以后，没法直接使用
 * created by weibin on 2019-04-15，
 * updated by weibin on 2019-09-17
 */
import { HdCmpsComponent } from 'types/component'
import { HdVideoPlugin, PluginMethodSuccess, Watermark, HdVideoPluginEvents, ProtocolType } from 'types/hd-video-type'
import { Component, Watch } from 'vue-property-decorator'
import { formatTime } from 'src/utils/date.js'
import { universalAttachEvent, universalDetachEvent, isIE } from 'src/utils/utils.js'
import { PROTOCOL, ERROR_CODE, MESSAGE_CODE } from 'src/utils/video-config'
import Cookies = require('js-cookie')

// 类型保护函数
function isValidPlugin(plugin: HdVideoPlugin | HdVideoPlugin[] | undefined): plugin is HdVideoPlugin {
  return typeof plugin !== 'undefined' && !Array.isArray(plugin)
}

function isValidWatermark(watermark: Watermark | undefined): watermark is Watermark {
  return typeof watermark !== 'undefined'
}

@Component
export default class VideoCommon extends HdCmpsComponent {
  // ========= 码流时延， 关键帧时延等信息用 start ===========
  sendRequestTime = 0 // 发送视频播放请求的时间
  receiveResponseTime = 0 // 收到播放请求的返回的时间
  isGB = false // 码流是否为国标格式
  hasSound = false // 是否有声音
  // ========= 码流时延， 关键帧时延等信息用 end =============
  showBackdrop = false // 是否显示背景板
  backdropWidth = '0px' // 背景板宽
  backdropHeight = '0px'

  // TODO 为了使用被注入组件的属性与方法
  playing!: boolean
  watermarkMsgObj: Watermark | undefined
  callId!: string
  deviceCode!: string
  $_getWatermarkSize!: (container: Element) => number
  readonly isDownload!: boolean
  $_pluginEvent(eventTag: 'add' | 'remove'): void {
    // do nothing
  }
  $_reset(): void {
    // do nothing
  }

  // 计算属性，获取plugin。获取的结果有可能是插件，数组，或者undefined
  get plugin(): HdVideoPlugin | HdVideoPlugin[] | undefined {
    const plugin = this.$refs.plugin
    if (typeof plugin === 'undefined') return undefined
    if (plugin instanceof Element) return (plugin as unknown) as HdVideoPlugin
    return (plugin as unknown) as HdVideoPlugin[]
  }

  @Watch('isGB')
  onIsGBChange(newVal: boolean): void {
    this.$emit('updateGBInfo', newVal)
  }

  @Watch('hasSound')
  onHasSoundChange(newVal: boolean): void {
    this.$emit('hasSound', newVal)
  }

  /**
   * 视频抓拍
   */
  capture(path = 'D:\\', name = '视频截图'): PluginMethodSuccess {
    // 只有视频在播放状态才有视频抓拍的意义
    if (!this.playing || !isValidPlugin(this.plugin)) return -1
    const date: string = this.$_formatTime(new Date())
    let filePath = `${path}\\${name}_${date}.png`
    if (isIE()) filePath = encodeURI(filePath)
    const watermark = isValidWatermark(this.watermarkMsgObj) ? `${this.watermarkMsgObj.name} \r\n${this.watermarkMsgObj.cardId}\r\n ${this.watermarkMsgObj.systemName}` : ''
    return this.plugin.HDPlayer_PicSnap(filePath, watermark, 50, 80)
  }
  /**
   * 局部区域放大
   */
  zoomIn(): boolean {
    if (isValidPlugin(this.plugin)) {
      this.plugin.HDPlayer_RegionZoom(5, 5, 95, 95)
      return true
    }
    return false
  }
  /**
   * 视频恢复原始大小（放大后恢复）
   */
  zoomRecover(): boolean {
    if (isValidPlugin(this.plugin)) {
      this.plugin.HDPlayer_RegionZoom(0, 0, 0, 0)
      return true
    }
    return false
  }
  /**
   * 添加OSD水印
   */
  addWatermark(): void {
    if (isValidPlugin(this.plugin) && this.plugin instanceof Element) {
      const fontsize = this.$_getWatermarkSize(this.plugin)
      console.log('add watermark', this.watermarkMsgObj)
      const watermark = isValidWatermark(this.watermarkMsgObj) ? `${this.watermarkMsgObj.name} \r\n${this.watermarkMsgObj.cardId}\r\n${this.watermarkMsgObj.systemName}` : ''
      this.plugin.HDPlayer_SetOSDText(0, 0, 100, 100, 0, watermark, fontsize, 0, 255, 255, 255, 255)
    }
  }
  /**
   * 切换背景板的显示隐藏
   * （只在IE下生效）
   */
  toggleBackdrop(width = '420px', height = '136px'): void {
    if (isIE()) {
      this.backdropWidth = width
      this.backdropHeight = height
      this.showBackdrop = !this.showBackdrop
    }
  }
  /**
   * 单次事件绑定（事件只会触发一次）
   * @params event-事件（见插件文档）
   * @params callback-事件处理函数
   */
  bindEventOnce(event: HdVideoPluginEvents, callback: () => void): void {
    if (!isValidPlugin(this.plugin)) return
    const innerCallback = (): void => {
      callback()
      universalDetachEvent(this.plugin, event, innerCallback)
    }
    universalAttachEvent(this.plugin, event, innerCallback)
  }
  /**
   * 检测并打开端口
   * TODO 暂时需要区分下载与视频播放，后续通过插件提供的新接口统一
   */
  async $_openPort(plugin: HdVideoPlugin, ip: string, protocol: ProtocolType): Promise<number> {
    const OPEN_TIMES_LIMIT = 200 // 遇到端口被占用而重新打开端口的次数限制
    const DEFAULT_PORT = 30000 // 默认端口
    if (!ip || !protocol || !plugin) return Promise.reject('ip、protocol、插件均不能为空')
    return new Promise((resolve, reject) => {
      try {
        plugin.HDPlayer_Init()
        // 从cookie获取端口号，如存在，则在其基础上+2，如不存在，则默认值为30000
        // 约定key为videoPort
        let port = +Cookies.get('hdVideoPort') + 2 || DEFAULT_PORT
        for (let i = 0; i < OPEN_TIMES_LIMIT; i++) {
          if (plugin.HDPlayer_OpenMediaPort(ip, port, PROTOCOL[protocol.toUpperCase()]) > 0) {
            console.log(`init plugin and open port succeed， port is ${port}`)
            if (this.isDownload) {
              // 如果在下载组件中，则需要再+2保存与返回，因为之前的端口已被OpenMediaPort占用
              Cookies.set('hdVideoPort', port + 2, new Date(new Date().getTime() + 30 * 60 * 1000)) // 将成功的端口保存起来，有效期为30分钟
              resolve(port + 2)
            } else {
              Cookies.set('hdVideoPort', port, new Date(new Date().getTime() + 30 * 60 * 1000)) // 将成功的端口保存起来，有效期为30分钟
              resolve(port)
            }
            return
          } else {
            port += 2
          }
        }
        console.error('寻找端口的次数超出限制，端口打开失败')
        reject('寻找端口的次数超出限制，端口打开失败')
      } catch (e) {
        console.error(e)
        reject(e)
      }
    })
  }
  /**
   * 绑定插件事件
   */
  $_bindPluginEvent(): void {
    this.$_pluginEvent('add')
  }
  /**
   * 解除插件事件绑定
   */
  $_unbindPluginEvent(): void {
    this.$_pluginEvent('remove')
  }
  /**
   * 返回一个通用的事件绑定函数
   * @param eventTag
   * @return {_pluginEvent}
   */
  $_universalEventSetup(eventTag: 'add' | 'remove'): (event: HdVideoPluginEvents, callback: (e1, e2?, e3?, e4?, e5?, e6?) => void) => void {
    let _pluginEvent
    if (eventTag === 'add') {
      // 插件的事件处理函数可能接收两个参数或更多
      _pluginEvent = (event: HdVideoPluginEvents, callback: (e1, e2?, e3?, e4?, e5?, e6?) => void): void => {
        universalAttachEvent(this.plugin, event, callback)
      }
    } else {
      _pluginEvent = (event: HdVideoPluginEvents, callback: (e1, e2?, e3?, e4?, e5?, e6?) => void): void => {
        universalDetachEvent(this.plugin, event, callback)
      }
    }
    return _pluginEvent
  }
  $_setupCommonEvent(eventTag: 'add' | 'remove'): void {
    const _pluginEvent = this.$_universalEventSetup(eventTag)
    _pluginEvent('on_notifyLivePlay', this.$_videoPlayHandler)
    _pluginEvent('on_notifyLiveStop', this.$_videoStopHandler)
    _pluginEvent('on_notifyMouseLeftDown', this.$_clickHandler)
    _pluginEvent('on_notifyMouseDoubleClick', this.$_dbclickHandler)
    _pluginEvent('on_notifyMouseScroll', this.$_mouseScrollHandler)
    _pluginEvent('on_notifyMouseMoveIn', this.$_mouseMoveInHandler)
    _pluginEvent('on_notifyMsg', this.$_videoMessageEndHandler)
  }
  $_videoPlayHandler(e): void {
    console.log(`video is playing, callId: ${this.callId} deviceCode: ${this.deviceCode}`)
    this.playing = true
    this.$emit('videoPlay', e)
  }
  $_videoStopHandler(e): void {
    console.log('video stop')
    this.playing = false
    this.$emit('videoStop', e)
  }
  $_clickHandler(e): void {
    this.$emit('videoClick', e)
  }
  $_dbclickHandler(e): void {
    this.$emit('videoDbClick', e)
  }
  $_mouseScrollHandler(e): void {
    this.$emit('videoMouseScroll', e)
  }
  $_mouseMoveInHandler(e): void {
    this.$emit('videoMouseMoveIn', e)
  }
  /**
   * 错误处理
   */
  $_videoMessageEndHandler(e, msg): void {
    const errorCodeSet: number[] = Object.keys(ERROR_CODE).map(item => +item)
    const messageCodeSet: number[] = Object.keys(MESSAGE_CODE).map(item => +item)
    const msgActionMap = {
      5: (): void => {
        console.log('收到码流')
        const receiveStreamTime = new Date().getTime()
        this.$emit('updateStreamDelay', receiveStreamTime - this.receiveResponseTime)
      },
      6: (): void => {
        console.log('收到关键帧')
        const receiveKeyframeTime = new Date().getTime()
        this.$emit('updateKeyframeDelay', receiveKeyframeTime - this.receiveResponseTime)
      },
      7: (): void => {
        console.log('码流是国标格式')
        this.isGB = true
      },
      8: (): void => {
        console.log('码流含有音频')
        this.hasSound = true
      },
      9: (): void => {
        this.$emit('updateDateRate', msg)
      },
      10: (): void => {
        this.$emit('updateLostRate', msg)
      }
    }
    // 如果是错误消息，则进行处理
    if (errorCodeSet.includes(e)) {
      console.log('视频出错，原因：', ERROR_CODE[e])
      this.$_reset()
      this.$emit('videoError', e)
    } else if (messageCodeSet.includes(e)) {
      msgActionMap[e] && msgActionMap[e]()
    }
  }
  /**
   * 格式化时间
   * @param date
   * @returns {*}
   */
  $_formatTime(date): string {
    return formatTime(date, 'yyyy-MM-dd_hh-mm-ss')
  }
}
