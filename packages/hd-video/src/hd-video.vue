<template>
  <div class="hd-video-wrapper" ref="hdVideoWrapper">
    <object
      ref="plugin"
      type="application/x-hdvon"
      class="hd-video__plugin">
    </object>
    <div class="backdrop" v-show="showBackdrop">
      <iframe border="0" class="iframe" :style="{width: backdropWidth, height: backdropHeight}"></iframe>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 视频监控用视频播放器（不含控制条，标题条）
 * created by weibin on 2019/04/03
 * updated by weibin on 2019/09/18
 */
import { Watermark, ProtocolType, HdVideoPlugin, JainSipResponse, JainSipResponseBody, CloudDirection, CameraAdjustType } from 'types/hd-video-type' //eslint-disable-line
import { Component, Prop, Watch, Mixins, Vue } from 'vue-property-decorator'
import VideoApi from './api/video-ws'
import ControlApi from './api/control-ws'
import { PROTOCOL } from 'src/utils/video-config'
// 在webstorm下，下面这句也许会出现'Module is not listed in package.json dependencies'错误，与vue以及这里导入的是js有关，不知道确切原因，不过只是IDE报错不影响使用
import { isIE } from 'src/utils/utils.js'

// mixins 包含通用的视频播放逻辑与水印大小自适应逻辑
import VideoResizeWatermark from 'src/mixins/video-resize-watermark'
import VideoCommon from 'src/mixins/video-common'

// 类型保护函数
function isValidPlugin(plugin: HdVideoPlugin | HdVideoPlugin[] | undefined): plugin is HdVideoPlugin {
  return typeof plugin !== 'undefined' && !Array.isArray(plugin)
}

function isValidWatermark(watermark: Watermark | undefined): watermark is Watermark {
  return typeof watermark !== 'undefined'
}

@Component
export default class HdVideo extends Mixins(VideoCommon, VideoResizeWatermark) {
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

  readonly videoApi = new VideoApi<JainSipResponse>(this.websocket) // 视频播放相关接口
  readonly controlApi = new ControlApi<JainSipResponse>(this.websocket) // 云台控制相关接口
  deviceCode = '' // 缓存deviceCode
  callId = '' // 缓存callID
  playing = false // 是否正在播放
  private recording = false // 是否正在录像
  private enable3D = false // 是否正在启用3D放大

  @Watch('recording')
  onRecordingChange(newVal: boolean) {
    this.$emit('videoRecord', newVal)
  }

  mounted() {
    // 监听播放窗口变化，应付网页全屏、全屏等情况
    // 切分屏导致的播放窗口大小变化不需要在这里处理（添加水印的时候自动会根据当前大小计算合适的字体大小）
    if (this.$refs.hdVideoWrapper instanceof Element && isValidWatermark(this.watermarkMsgObj) && isValidPlugin(this.plugin)) {
      this.$_initResizeWatermark(this.$refs.hdVideoWrapper, this.watermarkMsgObj, this.plugin)
    }
  }

  /**
   * 播放
   */
  async play(deviceCode: string): Promise<JainSipResponseBody> {
    if (!deviceCode) throw new Error('deviceCode is empty')
    if (!isValidPlugin(this.plugin)) throw new Error('plugin is not valid')
    this.$_reset() // 重置一下
    const port = await this.$_openPort(this.plugin, this.ip, this.protocol)
    const fetchVideoRes = await this.$_fetchVideo(deviceCode, this.ip, port, this.protocol)
    console.log(`Request videoPlayStart succeed at ${this.receiveResponseTime}, result:`, fetchVideoRes)
    const fetchVideoResData = fetchVideoRes.result
    if (typeof fetchVideoResData === 'undefined') throw new Error('response is not valid')
    // 绑定事件（为了监听播放开始事件，需要在开始播放前即绑定事件）
    this.$_unbindPluginEvent() // 先解除之前的
    this.$_bindPluginEvent() // 再绑定新的
    // TODO 这里默认了fetchVideoResData是有host和port的，有待解耦合
    if (this.plugin.HDPlayer_LivePlay(fetchVideoResData.host, fetchVideoResData.port, PROTOCOL[this.protocol.toUpperCase()]) === 0) {
      // HDPlayer_LivePlay()返回值为0代表成功
      // 缓存callID与deviceCode
      this.deviceCode = deviceCode
      this.callId = fetchVideoResData.callId
    }
    return fetchVideoResData
  }
  /**
   * 停止
   */
  async stop(): Promise<void> {
    console.log(`toStop`, this.playing, this.callId, this.deviceCode)
    if (!this.deviceCode || !this.callId) throw new Error('nothing is playing')
    if (!this.playing) return
    return await new Promise((resolve, reject) => {
      this.videoApi.videoPlayStop({
        deviceID: this.deviceCode,
        callId: this.callId
      }).then(() => {
        console.log(`Request videoStop succeed`)
        if (isValidPlugin(this.plugin) && this.plugin.HDPlayer_LiveStop() === 0) {
          // HDPlayer_LiveStop()返回值为0代表调用成功
          const callback = (): void => {
            this.deviceCode = ''
            this.callId = ''
            console.log('stop video succeed')
            resolve()
          }
          this.bindEventOnce('on_notifyLiveStop', callback)
        } else {
          return reject()
        }
      }).catch(err => {
        reject(err)
      })
    })
  }
  /**
   * 暂停
   */
  pause(): boolean {
    // 只有视频在播放状态才有暂停和恢复的意义
    if (this.playing && isValidPlugin(this.plugin)) {
      this.plugin.HDPlayer_LivePause()
      this.$emit('videoPause')
      return true
    }
    return false
  }
  /**
   * 恢复
   */
  resume(): boolean {
    // 只有视频在播放状态才有暂停和恢复的意义
    if (this.playing && isValidPlugin(this.plugin)) {
      this.plugin.HDPlayer_LiveResume()
      this.$emit('videoResume')
      return true
    }
    return false
  }
  /**
   * 视频录像
   */
  record(path = 'D:\\', name = '视频录像'): boolean {
    // 只有视频在播放状态才有视频录像的意义
    if (!this.playing || !isValidPlugin(this.plugin)) {
      console.error('录像失败，没有正在播放的视频')
      return false
    }
    if (this.recording) {
      console.log(`实时录像已停止, 录像存放在${path}`)
      this.plugin.HDPlayer_StopCache()
      this.recording = false
      return true
    } else {
      const date = this.$_formatTime(new Date())
      let filePath = `${path}${name}\\${name}_${date}.mpg`
      filePath = filePath.replace(/\s+/g, '') // 去除所有空格
      if (isIE()) filePath = encodeURI(filePath)
      const status = this.plugin.HDPlayer_StartCache(filePath)
      if (status === -1) {
        console.error('存储的路径不存在,请确认后重试')
        return false
      } else {
        console.log(`实时录像已开始, 录像存放在${path}`)
        this.recording = true
        return true
      }
    }
  }
  /**
   * 云台方向控制
   */
  async cloudControl(direction: CloudDirection, speed = 150): Promise<void> {
    // 这里看起来有点多余，不过以前的话是对应一个个数字的，后来才改为对应现在的字符串
    const directionMap = {
      left: 'left',
      right: 'right',
      up: 'up',
      down: 'down',
      upLeft: 'upLeft',
      upRight: 'upRight',
      downLeft: 'downLeft',
      downRight: 'downRight',
      stop: 'stop'
    }
    if (!this.deviceCode) throw new Error('设备编码不存在')
    await this.controlApi.cloudControl({
      type: 'direction',
      direction: directionMap[direction],
      deviceID: this.deviceCode,
      speed
    })
  }
  /**
   * 焦距、光圈等设置
   */
  async cameraAdjust(type: CameraAdjustType, direction: 'positive' | 'negative', speed = 150): Promise<void> {
    const directionMap = {
      positive: 1,
      negative: 2
    }
    if (!this.deviceCode) throw new Error('设备编码不存在')
    await this.controlApi.cloudControl({
      type: type,
      [type]: directionMap[direction],
      deviceID: this.deviceCode,
      speed
    })
  }
  /**
   * 3d放大开启与关闭
   */
  toggle3dZoom(): boolean {
    if (!this.playing || !isValidPlugin(this.plugin)) {
      console.error('开启或关闭失败，没有正在播放的视频')
      return false
    }
    this.enable3D = !this.enable3D
    if (this.enable3D) {
      this.plugin.HDPlayer_EnableDrawNotify(1)
      console.log('已开启3d放大')
    } else {
      this.plugin.HDPlayer_EnableDrawNotify(0)
      console.log('已关闭3d放大')
    }
    return true
  }
  // =================私有方法 start=======================
  /**
   * 请求视频流
   */
  async $_fetchVideo(deviceCode: string, ip: string, port: number, protocol: ProtocolType): Promise<JainSipResponse> {
    this.sendRequestTime = new Date().getTime()
    const fetchVideoRes = await this.videoApi.videoPlayStart({
      deviceID: deviceCode,
      port: port,
      transport: protocol,
      encode: null,
      host: ip
    })
    this.receiveResponseTime = new Date().getTime()
    this.$emit('updateSipDelay', this.receiveResponseTime - this.sendRequestTime)
    return fetchVideoRes
  }
  /**
   * 设定插件事件
   */
  $_pluginEvent(eventTag: 'add' | 'remove'): void {
    const _pluginEvent = this.$_universalEventSetup(eventTag)
    this.$_setupCommonEvent(eventTag)
    _pluginEvent('on_notifyDrawEnd', this.$_videoDrawEndHandler)
  }
  /**
   * 视频内鼠标拖动事件处理
   */
  $_videoDrawEndHandler(width, height, x1, y1, x2, y2): void {
    // (x1, y1) 是开始拖动的点的坐标
    // (x2, y2) 是结束拖动的点的坐标
    const deviceCode = this.deviceCode
    if (this.enable3D && deviceCode) {
      const type = x2 - x1 > 0 ? 'amplify' : 'narrow'
      this.controlApi.dragZoom({
        deviceID: deviceCode,
        type: type,
        length: width,
        width: height,
        midPointX: Math.abs(x1 - x2) / 2 + Math.min(x1, x2), // 计算中点，拖动框的宽度的一半加上拖动框左上角点的x坐标
        midPointY: Math.abs(y1 - y2) / 2 + Math.min(y1, y2),
        lengthY: Math.abs(x1 - x2),
        lengthX: Math.abs(y1 - y2)
      })
    }
  }
  /**
   * 重置参数
   */
  $_reset(): void {
    this.deviceCode = ''
    this.callId = ''
    this.playing = false
    this.recording = false
    this.enable3D = false
    this.sendRequestTime = 0
    this.receiveResponseTime = 0
    this.isGB = false
    this.hasSound = false
  }
  // =================私有方法 end=======================
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .hd-video-wrapper {
    width: 100%;
    height: 100%;
    .hd-video__plugin {
      width: 100%;
      height: 100%;
    }
    .backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      text-align: center;
      .iframe {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        border: 0;
        background-color: #1f2f3d;
      }
    }
  }
</style>
