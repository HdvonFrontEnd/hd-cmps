## hd-video-download

监控录像下载组件---基于插件

插件仅支持firefox52以下版本以及IE浏览器

:::tip
需要安装HDVON的播放插件，配合HDVON的播放服务使用。
:::

:::demo 例子中的`websocket.sendMessage.bind(websocket)`是为了避免改变sendMessage方法中的this的指向。是否要加上bind视具体情况而定。
```html
<template>
	<div class="hd-video-download-example-wrapper">
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
		<div class="player-btn-group" v-if="websocket">
			<el-button size="mini" @click="startDownload">下载</el-button>
			<el-button size="mini" @click="stopDownload">停止</el-button>
			<el-button size="mini" @click="downloadNext">模拟被动下载下一段</el-button>
		</div>
		<hd-video-download
		  style="visibility: hidden"
			v-if="websocket"
			ref="downloader"
			:ip="infoForm.ip"
			:watermarkMsgObj="watermarkMsgObj"
			:websocket="websocket.sendMessage.bind(websocket)"
			@updateDownloadInfo="onUpdateDownloadInfo"></hd-video-download>
    <div v-else>请先连接WebSocket</div>
	</div>
</template>

<script>
export default {
  name: 'hd-video-download-example',
  data() {
    return {
      WS_ID: this.$genUUID(),
      websocket: null,
      watermarkMsgObj: {
        cardId: '1001',
        name: 'admin',
        systemName: 'watermark test'
      },
      infoForm: {
        token: 'token123',
        deviceCode: '321001',
        ip: '127.0.0.1',
        range: [new Date(new Date().getTime() - 10 * 60 * 1000), new Date(new Date().getTime())]
      }
    }
  },
  computed: {
    downloader() {
      return this.$refs.downloader
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
      this.websocket.interceptors.response.use((data) => {
        if (data.result.state === 'terminated') this.downloadNext()
        return data
      }, reqRejectedFun)
    },
    startDownload() {
      const startTime = this.$_formatTime(this.infoForm.range[0])
      const endTime = this.$_formatTime(this.infoForm.range[1])
      this.downloader.startDownload(this.infoForm.deviceCode, startTime, endTime)
    },
    stopDownload() {
      this.downloader.stopDownload()
    },
    downloadNext() {
      this.downloader.downloadNextSection()
    },
    onUpdateDownloadInfo(kbps, time, size) {
      console.log('下载中：', kbps, time, size)
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
startDownload | 开始下载，返回一个promise | (deviceCode, startTime, endTime, path, name) 接收5个参数，1. 设备编码deviceCode，2. startTime录像开始时间，String，格式为：'2019-04-09 16:46:02'， 3. endTime录像结束时间，String，格式为：'2019-04-09 16:46:02'， 4.path文件保存路径, String，默认为'D:\\'， 5.name文件名称, String，默认为'录像下载'
stopDownload | 停止下载 | —
downloadNextSection | 下载下一段 | —
### Events
事件名 | 说明 | 回调参数
--- | --- | --- |
downloadStart | 开始下载 | —
downloadStop | 停止下载 | —
downloadSectionIndexChange | 当前下载的视频段的索引发生变化 | —
updateDownloadInfo | 更新下载信息 | —
downloadError | 下载错误 | —