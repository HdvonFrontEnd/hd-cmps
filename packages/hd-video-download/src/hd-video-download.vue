<template>
  <div class="hd-video-download-wrapper">
    <object
      ref="plugin"
      type="application/x-hdvon"
      class="hd-video-playback__plugin"
    />
  </div>
</template>

<script lang="ts">
/**
 * 录像下载用基础组件
 * created by weibin on 2019/04/11
 * updated by weibin on 2019/09/24
 */
import { Watermark, ProtocolType, JainSipResponse, JainRecordListItem, HdVideoPlugin, DownloadSpeed } from 'types/hd-video-type' //eslint-disable-line
import { Component, Prop, Watch, Mixins, Vue } from 'vue-property-decorator'
import VideoDownloadApi from './api/video-download-ws'
import { PROTOCOL, ERROR_CODE } from 'src/utils/video-config'
import { isIE } from 'src/utils/utils.js'
// mixins 包含通用的视频播放与下载逻辑与水印大小自适应逻辑
import VideoCommon from 'src/mixins/video-common'

// 类型保护函数
function isValidPlugin(plugin: HdVideoPlugin | HdVideoPlugin[] | undefined): plugin is HdVideoPlugin {
  return typeof plugin !== 'undefined' && !Array.isArray(plugin)
}

function isValidWatermark(watermark: Watermark | undefined): watermark is Watermark {
  return typeof watermark !== 'undefined'
}

function isValidRecordList(recordList: JainRecordListItem[] | undefined): recordList is JainRecordListItem[] {
  return typeof recordList !== 'undefined'
}

@Component
export default class HdVideoDownload extends Mixins(VideoCommon) {
  readonly isDownload = true // 用于$_openPort中的区分
  // 对于使用了mixin的组件，只能通过这种方式，显示指定一下
  static install(vue: typeof Vue): void { console.log('you need to rewrite the install static function') }
  // 本机ip信息
  @Prop({ type: String, required: true }) readonly ip: string
  // websocket实例的sendMessage方法
  @Prop({ type: Function, required: true }) readonly websocket: <T>(...args) => Promise<T>
  // 播放网络协议（tcp或udp）
  @Prop({ type: String, default: 'UDP' }) readonly protocol: ProtocolType
  // 水印信息
  @Prop({ type: Object }) readonly watermarkMsgObj: Watermark | undefined
  readonly videoDownloadApi = new VideoDownloadApi<JainSipResponse>(this.websocket) // 录像下载相关接口
  deviceCode = '' // 缓存deviceCode
  path = '' // 缓存录像下载路径
  name = '' // 缓存录像名称
  callId = '' // 缓存callID
  speed: DownloadSpeed = 4 // 下载倍数，只能是 1，2，4，8 倍
  downloading = false // 是否正在下载
  currentIndex = 0 // 当前下载的段在录像列表里面的索引
  recordList: JainRecordListItem[] = [] // 录像列表

  @Watch('currentIndex')
  onCurrentIndexChange(newVal: number): void {
    this.$emit('downloadSectionIndexChange', newVal)
  }

  /**
   * 开始下载
   */
  async startDownload(deviceCode: string, startTime: string, endTime: string, path = 'D:\\', name = '录像下载'): Promise<void> {
    if (!deviceCode || !startTime || !endTime) throw new Error('deviceCode, 开始时间，结束时间均不能为空')
    this.path = path
    this.name = name
    this.$_reset() // 重置信息
    const recordList = await this.$_getDownloadRecordList(deviceCode, startTime, endTime)
    if (recordList.length < 1) {
      console.log('该时间段没有录像，请重新选择时间段')
      throw new Error('该时间段没有录像，请重新选择时间段')
    } else {
      await this.$_fetchDownload(deviceCode, recordList[0].startTime, recordList[0].endTime, recordList[0].uri)
      this.currentIndex = 0
    }
  }
  /**
   * 停止下载
   */
  async stopDownload(): Promise<void> {
    console.warn('暂不支持中止下载视频流，仅能通知插件不再接收，保存文件')
    await this.saveDownload()
  }
  /**
   * 下载下一段
   * 下完一段之后，应该先保存，再请求下载下一段
   * 此处与录像回放一样，需要在业务上判断下载下一段的时机，然后调用这个方法去下载下一段
   */
  async downloadNextSection(): Promise<number> {
    if (!this.deviceCode || !isValidPlugin(this.plugin)) {
      console.log('deviceCode或插件不存在')
      throw new Error('deviceCode或插件不存在')
    }
    try {
      await this.saveDownload()
      console.log('保存成功')
    } catch (err) {
      console.error('保存失败', err)
      throw new Error('保存失败')
    }
    if (this.currentIndex + 1 >= this.recordList.length) {
      console.log('下载完成')
      this.$_reset()
      return this.currentIndex
    } else {
      const nextIdx = this.currentIndex + 1
      const nextRecord = this.recordList[nextIdx]
      await this.$_fetchDownload(this.deviceCode, nextRecord.startTime, nextRecord.endTime, nextRecord.uri)
      return ++this.currentIndex
    }
  }
  /**
   * 停止视频文件下载保存 TODO 没有触发事件
   */
  async saveDownload(): Promise<void> {
    await new Promise((resolve, reject) => {
      if (isValidPlugin(this.plugin) && this.plugin.HDPlayer_StopVideoDownload() === 0) {
        setTimeout(() => {
          console.log('save download succeed')
          resolve()
        }, 500)
        // const callback = () => {
        //   console.log('save download succeed')
        //   resolve()
        // }
        // this.bindEventOnce('on_notifyStopVideoDownload', callback)
      } else {
        reject('save download failed')
      }
    })
  }
  // =============== 私有方法 start =================
  /**
   * 获取下载录像列表
   */
  async $_getDownloadRecordList(deviceCode: string, startTime: string, endTime: string): Promise<JainRecordListItem[]> {
    if (!deviceCode || !startTime || !endTime) throw new Error('deviceCode, 开始时间，结束时间均不能为空')
    const res = await this.videoDownloadApi.queryDownloadRecord({
      deviceID: deviceCode,
      startTime: startTime,
      endTime: endTime
    })
    if (res && res.result && isValidRecordList(res.result.recordList)) {
      this.recordList = res.result.recordList
      return this.recordList
    } else {
      throw new Error('获取录像列表出错')
    }
  }
  /**
   * 请求视频流，用于下载
   */
  async $_fetchDownload(deviceCode: string, startTime: string, endTime: string, uri: string): Promise<void> {
    if (!isValidPlugin(this.plugin)) throw new Error('plugin is not valid')
    try {
      const port = await this.$_openPort(this.plugin, this.ip, this.protocol)
      const res = await this.videoDownloadApi.recordDownLoad({
        deviceID: deviceCode,
        transport: this.protocol,
        host: this.ip,
        encode: null,
        speed: this.speed,
        port,
        startTime,
        endTime,
        uri
      })
      const resData = res.result
      if (!resData) throw new Error('Got a response from Video Download request, but the response is not valid')
      console.log('Request Video Download succeed, result:', res)
      // 绑定事件（为了监听下载开始事件，需要在开始下载前即绑定事件）
      this.$_unbindPluginEvent() // 先解除之前的
      this.$_bindPluginEvent() // 再绑定新的
      const date = this.$_formatTime(new Date())
      let savePath = `${this.path}\\${this.name}\\录像回放_${this.name}_${date}.mpg`
      if (isIE()) savePath = encodeURI(savePath)
      const watermark = isValidWatermark(this.watermarkMsgObj) ? `${this.watermarkMsgObj.name}\r\n${this.watermarkMsgObj.cardId}\r\n${this.watermarkMsgObj.systemName}` : ''
      console.log(resData.host, resData.port, PROTOCOL[this.protocol], savePath, watermark, 30, 0, 0, 50, '<+++++++++++++++')
      if (this.plugin.HDPlayer_StartVideoDownload(resData.host, resData.port, PROTOCOL[this.protocol], savePath, watermark, 30, 0, 0, 50) === 0) {
        // 缓存callID与deviceCode
        this.deviceCode = deviceCode
        this.callId = resData.callId
      } else {
        throw new Error('调用插件的下载接口失败')
      }
    } catch (err) {
      this.recordList = []
      console.log('下载失败')
      throw new Error(err)
    }
  }
  /**
   * 事件绑定操作
   */
  $_pluginEvent(eventTag: 'add' | 'remove'): void {
    if (!this.plugin || !eventTag) return
    const _pluginEvent = this.$_universalEventSetup(eventTag)
    _pluginEvent('on_notifyStartVideoDownload', this.$_downloadStartHandler)
    _pluginEvent('on_notifyStopVideoDownload', this.$_downloadStopHandler)
    _pluginEvent('on_notifyDownloadParameter', this.$_downloadInfoUpdateHandler)
    _pluginEvent('on_notifyMsg', this.$_downloadErrorHandler)
  }
  /**
   * 下载开始
   */
  $_downloadStartHandler(e): void {
    console.log(`video is downloading, callId: ${this.callId}, deviceCode: ${this.deviceCode}`)
    this.downloading = true
    this.$emit('downloadStart', e)
  }
  /**
   * 下载停止
   */
  $_downloadStopHandler(e): void {
    console.log('download stop')
    this.downloading = false
    this.$emit('downloadStop', e)
  }
  /**
   * 下载参数更新
   */
  $_downloadInfoUpdateHandler(kbps: number, time: number, size: number): void {
    console.log('updateDownloadInfo', kbps, time, size)
    this.$emit('updateDownloadInfo', kbps, time, size)
  }
  /**
   * 错误处理
   */
  $_downloadErrorHandler(code: number): void {
    const errorCodeSet = Object.keys(ERROR_CODE).map(item => +item)
    // 如果是错误消息，则进行处理
    if (errorCodeSet.includes(code)) {
      console.log('下载出错，原因：', ERROR_CODE[code], code)
      this.$_reset()
      this.$emit('downloadError', code)
    }
  }
  /**
   * 重置参数
   */
  $_reset(): void {
    this.currentIndex = 0
    this.recordList = []
    this.deviceCode = ''
    this.callId = ''
    this.downloading = false
  }
  // =============== 私有方法 end =================
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .hd-video-download-wrapper {
    width: 1px;
    height: 0;
  }
</style>
