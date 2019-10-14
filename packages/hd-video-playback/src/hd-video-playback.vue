<template>
  <div class="hd-video-playback-wrapper" ref="hdVideoPlaybackWrapper">
    <object
      ref="plugin"
      type="application/x-hdvon"
      class="hd-video-playback__plugin"
    />
    <div class="backdrop" v-show="showBackdrop">
      <iframe border="0" class="iframe" :style="{width: backdropWidth, height: backdropHeight}"></iframe>
    </div>
  </div>
</template>

<script lang="ts">
/**
 * 录像回放用视频基础组件
 * created by weibin on 2019/04/08
 * updated by weibin on 2019/09/23
 */
import { Component, Prop, Watch, Mixins, Vue } from 'vue-property-decorator'
import { Watermark, ProtocolType, HdVideoPlugin, JainSipResponse, JainSipResponseBody, JainRecordListItem, VideoSpeed } from 'types/hd-video-type' //eslint-disable-line

import VideoReplayApi from './api/video-replay-ws'
import { PROTOCOL } from 'src/utils/video-config'

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

function isValidRecordList(recordList: JainRecordListItem[] | undefined): recordList is JainRecordListItem[] {
  return typeof recordList !== 'undefined'
}

// 播放速率代码
const SPEED_CODE = {
  '0.25': 1,
  '0.5': 2,
  '1': 3,
  '2': 4,
  '4': 5,
  '8': 6
}

@Component
export default class HdVideoPlayback extends Mixins(VideoCommon, VideoResizeWatermark) {
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

  readonly videoReplayApi = new VideoReplayApi<JainSipResponse>(this.websocket) // 录像回放相关接口
  deviceCode = '' // 缓存deviceCode
  callId = '' // 缓存callID
  playing = false // 是否正在播放
  currentIndex = 0 // 当前播放的段在录像列表里面的索引
  recordList: JainRecordListItem[] = [] // 录像列表
  speed: VideoSpeed = '1' // 播放速率，0.25、0.5、1、2、4、8倍

  @Watch('currentIndex')
  onCurrentIndexChange(newVal) {
    this.$emit('sectionIndexChange', newVal)
  }

  mounted() {
    // 监听播放窗口变化，应付网页全屏、全屏等情况
    // 切分屏导致的播放窗口大小变化不需要在这里处理（添加水印的时候自动会根据当前大小计算合适的字体大小）
    if (this.$refs.hdVideoPlaybackWrapper instanceof Element && isValidWatermark(this.watermarkMsgObj) && isValidPlugin(this.plugin)) {
      this.$_initResizeWatermark(this.$refs.hdVideoPlaybackWrapper, this.watermarkMsgObj, this.plugin)
    }
  }

  /**
   * 播放录像
   */
  async play(deviceCode: string, startTime: string, endTime: string): Promise<JainSipResponseBody> {
    if (!deviceCode) throw new Error('deviceCode is empty')
    this.$_reset() // 重置信息
    const recordList = await this.$_getRecordList(deviceCode, startTime, endTime)
    this.$emit('getRecordListInfo', recordList)
    if (recordList.length < 1) {
      console.log('该段时间没有录像,请重新选择时间段')
      throw new Error('该段时间没有录像,请重新选择时间段')
    } else {
      // 获取第一段录像进行播放
      const fetchRecVideoResponse = await this.$_fetchRecVideo(deviceCode, recordList[0].startTime, recordList[0].endTime, recordList[0].uri)
      this.currentIndex = 0
      return fetchRecVideoResponse
    }
  }
  /**
   * 停止播放
   */
  async stop(): Promise<void> {
    console.log(`toStop`, this.playing, this.callId, this.deviceCode)
    if (!this.deviceCode || !this.callId) throw new Error('nothing is playing')
    if (!this.playing) return
    await this.videoReplayApi.videoPlaybackStop({
      deviceID: this.deviceCode,
      callId: this.callId
    })
    console.log(`Request videoStop succeed`)
    await this.$_stopPlugin()
  }
  /**
   * 暂停播放
   */
  async pause(): Promise<void> {
    if (!isValidPlugin(this.plugin)) throw new Error('plugin is not valid')
    console.log('pluginPlayerPause:---')
    await this.videoReplayApi.playbackControl({
      deviceID: this.deviceCode,
      callId: this.callId,
      type: 'pause'
    })
    console.log('暂停成功')
    this.plugin.HDPlayer_LivePause()
  }
  /**
   * 恢复播放
   */
  async resume(): Promise<void> {
    if (!isValidPlugin(this.plugin)) throw new Error('plugin is not valid')
    console.log('pluginPlayerResume:---')
    await this.videoReplayApi.playbackControl({
      deviceID: this.deviceCode,
      callId: this.callId,
      type: 'play',
      scale: SPEED_CODE[`${this.speed}`]
    })
    console.log('恢复成功')
    this.plugin.HDPlayer_LiveResume()
  }
  /**
   * 设置播放倍数
   */
  async playSpeed(speed: VideoSpeed = '1'): Promise<void> {
    console.log('pluginPlayer playSpeed:---', speed)
    await this.videoReplayApi.playbackControl({
      deviceID: this.deviceCode,
      callId: this.callId,
      type: 'multiple',
      scale: SPEED_CODE[`${speed}`]
    })
    this.speed = speed // 缓存播放速率信息
    console.log('播放倍速设置成功')
  }
  /**
   * 主动跳到下一段或上一段（需要先停原有视频流）
   * @param direction-'next'/'pre' (上一段还是下一段)
   * @param index -(当前播放屏索引)
   */
  async jumpToNextVideo(direction: 'next' | 'pre'): Promise<number> {
    await this.$_switchVideoSection(direction, true)
    return direction === 'next' ? ++this.currentIndex : --this.currentIndex
  }
  /**
   * 被动跳到下一段（不用先停原有视频流，只需要调用插件的停止播放）
   * TODO 要实现播完一段自动播放下一段的功能，需要在业务上判断播放的时机，然后调用这个方法播放下一段
   */
  async playNextVideoSection(): Promise<number> {
    await this.$_switchVideoSection('next', false)
    await this.playSpeed(this.speed) // 恢复播放速率
    return ++this.currentIndex
  }
  /**
   * 快进到x时间
   * 分为同段快进与跳段快进，
   * 同段快进只需要发ws请求到后台，跨段快进需要先请求目标段的播放，再请求到目标时间。
   * @param timeStamp-目标时间对应的时间戳
   */
  async seekTo(timeStamp: number): Promise<void> {
    const targetSectionIdx = this.recordList.findIndex(section => {
      if (!section.startTimestamp || !section.endTimestamp) return false
      return section.startTimestamp <= timeStamp && timeStamp <= section.endTimestamp // 如果目标时间戳正在在该段的开始与结束时间戳之间，则该段为目标段
    })
    if (targetSectionIdx === -1) {
      console.error('该时间点没有录像')
      throw new Error('该时间点没有录像')
    }
    const startTimestamp = this.recordList[targetSectionIdx].startTimestamp
    if (!startTimestamp) {
      throw new Error('startTimestamp is not exist')
    }
    const targetTimeSec = Math.floor((timeStamp - startTimestamp) / 1000) // 目标时间与所在段开始时间的差值（秒）
    if (targetSectionIdx === this.currentIndex) {
      // 同段
      await this.$_sameSectionSeek(targetTimeSec)
    } else {
      // 跨段
      await this.$_crossSectionSeek(targetTimeSec, targetSectionIdx)
    }
    console.log('快进成功后恢复播放速率')
    await this.playSpeed(this.speed) // 恢复播放速率
  }
  // =============== 私有方法 start =================
  /**
   * 停止插件播放
   */
  async $_stopPlugin(): Promise<void> {
    return await new Promise((resolve, reject) => {
      if (isValidPlugin(this.plugin) && this.plugin.HDPlayer_LiveStop() === 0) {
        console.log('stop video succeed')
        const callback = () => {
          resolve()
        }
        this.bindEventOnce('on_notifyLiveStop', callback)
      } else {
        reject('stop video failed')
      }
    })
  }
  /**
   * 同段快进
   */
  async $_sameSectionSeek(targetTimeSec: number): Promise<void> {
    await this.videoReplayApi.playbackControl({
      type: 'randomPlay',
      deviceID: this.deviceCode,
      callId: this.callId,
      range: targetTimeSec,
      scale: SPEED_CODE[`${this.speed}`] // 默认
    })
    console.log(`同段快进成功，快进到：${targetTimeSec}`)
  }
  /**
   * 跨段快进
   */
  async $_crossSectionSeek(targetTimeSec: number, targetSectionIdx: number): Promise<void> {
    await this.$_switchVideoSection(targetSectionIdx, true)
    console.log('=========跨段快进, 请求目标段成功=============')
    await this.videoReplayApi.playbackControl({
      type: 'randomPlay',
      deviceID: this.deviceCode,
      callId: this.callId,
      range: targetTimeSec,
      scale: SPEED_CODE[`${this.speed}`] // 默认
    })
    this.currentIndex = targetSectionIdx
    console.log(`跨段快进成功，快进到：${targetTimeSec}`)
  }
  /**
   * 切换段落
   * @param direction 方向，next-下一段，pre-上一段，数字-指定段落
   * @param isHardStop 是否需要停流，true为需要停流
   * @returns {*}
   */
  async $_switchVideoSection(direction: 'next' | 'pre' | number, isHardStop: boolean): Promise<void> {
    if (!this.deviceCode || !this.plugin) {
      console.log('deviceCode或插件不存在')
      throw new Error('deviceCode或插件不存在')
    }
    // 求出目标段的索引
    const targetIndex = this.$_getTargetIndex(direction)
    // 判断目标段是否存在，存在则跳段
    if (!targetIndex || !this.recordList[targetIndex]) {
      console.error('录像不存在')
      throw new Error('录像不存在')
    }
    const targetRecord = this.recordList[targetIndex]
    if (isHardStop) {
      // 需要停流
      await this.stop()
    } else {
      // 不需要停流
      await this.$_stopPlugin()
    }
    await this.$_fetchRecVideo(this.deviceCode, targetRecord.startTime, targetRecord.endTime, targetRecord.uri)
  }
  /**
   * 获取目标段索引
   * @param direction 方向，next-下一段，pre-上一段，数字-指定段落
   */
  $_getTargetIndex(direction: 'next' | 'pre' | number): number | undefined {
    const recordList = this.recordList
    const currentIndex = this.currentIndex
    if (direction === 'next') {
      if (currentIndex + 1 >= recordList.length) {
        console.error('没有下一段')
      } else {
        return currentIndex + 1
      }
    } else if (direction === 'pre') {
      if (currentIndex - 1 < 0) {
        console.error('没有上一段')
      } else {
        return currentIndex - 1
      }
    } else if (Number.isInteger(direction)) {
      return direction
    }
  }
  /**
   * 获取录像列表
   */
  async $_getRecordList(deviceCode: string, startTime: string, endTime: string): Promise<JainRecordListItem[]> {
    try {
      const res = await this.videoReplayApi.queryReplayRecord({
        deviceID: deviceCode,
        startTime: startTime,
        endTime: endTime
      })
      if (res && res.result && isValidRecordList(res.result.recordList)) {
        const recordList = res.result.recordList.map(recordItem => {
          return {
            ...recordItem,
            startTimestamp: new Date(recordItem.startTime).getTime(), // 将开始、结束时间转换成对应时间戳
            endTimestamp: new Date(recordItem.endTime).getTime()
          }
        })
        console.log(recordList, '<======获取到的录像列表')
        this.recordList = recordList
        return recordList
      } else {
        throw new Error('recordList is undefined')
      }
    } catch (err) {
      console.log('录像列表获取出错', err)
      this.recordList = []
      throw new Error(err)
    }
  }
  /**
   * 请求视频流(包括获取端口，打开端口，请求播放)
   */
  async $_fetchRecVideo(deviceCode: string, startTime: string, endTime: string, uri: string): Promise<JainSipResponseBody> {
    if (!isValidPlugin(this.plugin)) throw new Error('plugin is not valid')
    try {
      const port = await this.$_openPort(this.plugin, this.ip, this.protocol)
      this.sendRequestTime = new Date().getTime()
      const res = await this.videoReplayApi.videoPlayback({
        deviceID: deviceCode,
        transport: this.protocol,
        host: this.ip,
        encode: null,
        port,
        startTime,
        endTime,
        uri
      })
      this.receiveResponseTime = new Date().getTime()
      this.$emit('updateSipDelay', this.receiveResponseTime - this.sendRequestTime)
      console.log(`Request videoPlayStart succeed, result:`, res)
      if (res && res.result) {
        const resData = res.result
        // 绑定事件（为了监听播放开始事件，需要在开始播放前即绑定事件）
        this.$_unbindPluginEvent() // 先解除之前的
        this.$_bindPluginEvent() // 再绑定新的
        if (isValidPlugin(this.plugin) && this.plugin.HDPlayer_LivePlay(resData.host, resData.port, PROTOCOL[this.protocol]) === 0) {
          // 缓存callID与deviceCode
          this.deviceCode = deviceCode
          this.callId = resData.callId
          return resData
        } else {
          throw new Error('something went wrong when trying to play video')
        }
      } else {
        throw new Error('response data is not valid')
      }
    } catch (err) {
      this.recordList = []
      console.log('播放失败')
      throw new Error(err)
    }
  }
  /**
   * 事件绑定操作
   */
  $_pluginEvent(eventTag: 'add' | 'remove'): void {
    if (!this.plugin || !eventTag) return
    const _pluginEvent = this.$_universalEventSetup(eventTag)
    this.$_setupCommonEvent(eventTag)
    _pluginEvent('on_notifyPlayTime', this.$_videoGetPlayTime)
  }
  /**
   * 当前播放时间更新
   */
  $_videoGetPlayTime(sec: number): void {
    this.$emit('videoTimeUpdate', sec)
  }
  /**
   * 重置参数
   */
  $_reset(): void {
    this.currentIndex = 0
    this.recordList = []
    this.deviceCode = ''
    this.callId = ''
    this.playing = false
    this.sendRequestTime = 0
    this.receiveResponseTime = 0
    this.isGB = false
    this.hasSound = false
  }
  // =============== 私有方法 end =================
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.hd-video-playback-wrapper {
  width: 100%;
  height: 100%;
  .hd-video-playback__plugin {
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
