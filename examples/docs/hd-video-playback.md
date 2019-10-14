## hd-video-playback

录像回放组件---基于插件

插件仅支持firefox52以下版本以及IE浏览器

:::tip
需要安装HDVON的播放插件，配合HDVON的播放服务使用。
:::

:::demo 例子中的`websocket.sendMessage.bind(websocket)`是为了避免改变sendMessage方法中的this的指向。是否要加上bind视具体情况而定。
```html
<template>
  <div class="hd-video-playback-example-wrapper">
    <el-form class="info-input" :model="infoForm" :inline="true" size="mini">
      <el-form-item label="TOKEN">
        <el-input v-model="infoForm.token"></el-input>
      </el-form-item>
      <el-form-item label="设备deviceCode">
        <el-input v-model="infoForm.deviceCode"></el-input>
      </el-form-item>
      <el-form-item label="本机IP">
        <el-input v-model="infoForm.ip"></el-input>
      </el-form-item>
      <el-form-item label="录像时间段">
        <el-date-picker
          v-model="infoForm.range"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" @click="connectWs">连接websocket</el-button>
    </el-form>
    <div :style="{width: large ? '1256px' : '628px', height: large ? '856px' : '428px'}">
      <hd-video-playback
        v-if="websocket"
        ref="player"
        :ip="infoForm.ip"
        :watermarkMsgObj="watermarkMsgObj"
        :websocket="websocket.sendMessage.bind(websocket)"
        @updateStreamDelay="e => streamDelay = e"
        @updateKeyframeDelay="e=> keyframeDelay = e"
        @updateSipDelay="e=> sipDelay = e"
        @updateGBInfo="e=> isGB = e"
        @updateSoundInfo="e=> hasSound = e">
      </hd-video-playback>
      <div style="height: 100%; display: flex; align-items: center; justify-content: center" v-else>
        请先连接websocket
      </div>
    </div>
    <div class="player-info-group">
      <div class="player-info-item">信令时延：{{sipDelay}} ms</div>
      <div class="player-info-item">码流时延：{{streamDelay}} ms</div>
      <div class="player-info-item">关键帧时延：{{keyframeDelay}} ms</div>
      <div class="player-info-item">是否国标：{{isGB ? '是' : '否'}}</div>
      <div class="player-info-item">是否含有音频：{{hasSound ? '是' : '否'}}</div>
    </div>
    <div class="player-btn-group">
      <el-button size="mini" @click="playVideo">播放</el-button>
      <el-button size="mini" @click="stopVideo">停止</el-button>
      <el-button size="mini" @click="pauseVideo">暂停</el-button>
      <el-button size="mini" @click="resumeVideo">恢复</el-button>
      <el-button size="mini" @click="capture">截图</el-button>
      <el-button size="mini" @click="addWatermark">添加水印</el-button>
      <el-button size="mini" @click="toggleSpeed">切换播放速率</el-button>
      <el-button size="mini" @click="zoomIn">视频放大</el-button>
      <el-button size="mini" @click="playNext">模拟被动跳到下一段</el-button>
      <el-button size="mini" @click="seekTo">快进/快退到：</el-button>
      <el-date-picker
        style="margin-right: 10px"
        size="mini"
        v-model="seekTime"
        type="datetime"
        placeholder="快进/快退到">
      </el-date-picker>
      <el-button size="mini" @click="large = !large">水印大小自适应</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hd-video-playback-example',
  data() {
    return {
      WS_ID: this.$genUUID(),
      websocket: null,
      watermarkMsgObj: {
        cardId: '1001',
        name: 'admin',
        systemName: 'watermark test'
      },
      large: false,
      curSpeed: '1',
      seekTime: new Date(),
      infoForm: {
        token: 'token123',
        deviceCode: '321001',
        ip: '127.0.0.1',
        range: [new Date(new Date().getTime() - 24 * 60 * 60 * 1000), new Date()]
      },
      streamDelay: 0, // 码流时延
      keyframeDelay: 0, // 关键帧时延
      sipDelay: 0, // 信令时延
      isGB: false, // 码流是否为国标格式
      hasSound: false // 是否有声音
    }
  },
  computed: {
    player() {
      return this.$refs.player
    }
  },
  methods: {
    connectWs() {
      const WS_URL = `ws://this.is.a.fake.url?wsId=${this.WS_ID}&token=${this.infoForm.token}`
      this.websocket = new this.$websocket({ wsUrl: WS_URL })
      this.websocket.initWs()
      const reqFulfilledFun = (data) => {
        return {
          token: this.infoForm.token,
          wsId: this.WS_ID,
          version: '1.0',
          ...data
        }
      }
      const reqRejectedFun = (err) => {
        console.log(err, '<======请求错误，执行请求拦截器的错误回调')
      }
      this.websocket.interceptors.request.use(reqFulfilledFun, reqRejectedFun)
    },
    playVideo() {
      const startTime = this.$_formatTime(this.infoForm.range[0])
      const endTime = this.$_formatTime(this.infoForm.range[1])
      this.player.play(this.infoForm.deviceCode, startTime, endTime).then(() => {
        this.addWatermark()
      })
    },
    stopVideo() {
      this.player.stop()
    },
    pauseVideo() {
      this.player.pause()
    },
    resumeVideo() {
      this.player.resume(this.curSpeed)
    },
    capture() {
      this.player.capture()
    },
    toggleSpeed() {
      this.curSpeed = this.curSpeed === '1' ? '4' : '1'
      this.player.playSpeed(this.curSpeed)
    },
    addWatermark() {
      this.player.addWatermark()
    },
    zoomIn() {
      this.player.zoomIn()
    },
    playNext() {
      this.player.playNextVideoSection().then(() => {
        this.addWatermark()
      })
    },
    seekTo() {
      const timeStamp = this.seekTime.getTime()
      this.player.seekTo(timeStamp).then(() => {
        console.log('==========跳段成功===========')
        this.addWatermark()
      })
    },
    $_formatTime(date) {
      return this.$formatTime(date, 'yyyy-MM-dd hh:mm:ss')
    }
  }
}
</script>
```
:::

### Attributes
参数|说明|类型|可选值|默认值|
---|---|---|---|---|
ip | 本机IP | String | — | 无
websocket | 用于发送websocket消息的方法 | Function | — | 无
watermarkMsgObj | 水印信息，需要包含name，cardId，systemName字段 | Object | — | 无
protocol | 播放网络协议 | String | UDP / TCP | UDP
  
### Methods
方法名|说明|参数
---|---|---|
play | 播放视频，返回一个promise | (deviceCode, startTime, endTime) 接收三个参数，1. deviceCode设备编码，2. startTime录像开始时间，String，格式为：'2019-04-09 16:46:02'，3. endTime录像结束时间， String，格式为：'2019-04-09 16:46:02'
stop | 停止视频，返回一个promise | —
pause | 暂停视频 | —
resume | 恢复视频 | —
playSpeed | 设置播放倍数，返回一个promise | (speed) 接收播放倍数，String，默认为'1'，可选值为：'0.25','0.5','1','2','4','8'
capture | 截图，返回一个布尔值代表是否成功 | (path, name) 接收两个参数，1. 存储路径，默认为`'D:\\'` 2. 文件名称，默认为`'视频截图'`
zoomIn | 视频放大 | —
zoomRecover | 视频恢复原始大小（放大后恢复） | —
addWatermark | 添加OSD水印 | —
jumpToNextVideo | 切换到列表中的某一段视频，返回一个promise | (direction) 接收一个目标段落，String或Number，可选值为：'next'-下一段，'pre'-上一段，数字-指定段落索引
playNextVideoSection | 切换到下一段视频，返回一个promise | —
seekTo | 快进/快退到某时间，返回一个promise | (timeStamp) 接收一个目标时间的时间戳，Number

### Events
事件名 | 说明 | 回调参数
--- | --- | --- |
videoClick | 点击视频 | — 
videoDbClick | 双击视频 | — 
videoMouseScroll | 鼠标滚动 | — 
videoMouseMoveIn | 鼠标移入视频 | — 
videoPlay | 视频播放 | — 
videoStop | 视频停止 | — 
videoTimeUpdate | 视频播放时间更新 | — 
videoError | 视频播放插件检测到异常 | — 
updateStreamDelay | 更新码流时延信息 | — 
updateKeyframeDelay | 更新关键帧时延信息 | — 
updateSipDelay | 更新关键帧时延信息 | — 
updateGBInfo | 更新是否为国标码流的信息 | — 
updateSoundInfo | 更新是否为有声音 | — 
updateDateRate | 更新码率（kbps） | — 
updateLostRate | 更新丢包率（千分） | — 