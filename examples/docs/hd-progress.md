## progress 播放进度条

progress 播放进度条

### 基础用法
:::demo 
```html
<template>
  <div class="hd-progress-example-wrapper">
    <div class="form-box">
      <div>
        <span>选择范围：</span>
        <el-radio-group v-model="enableRang" size="mini">
          <el-radio-button :label="true">打开</el-radio-button>
          <el-radio-button :label="false">关闭</el-radio-button>
        </el-radio-group>
        <span>{{range}}</span>
      </div>
      <div style="display: flex;align-items: center; height: 50px">
        <span>缩放倍数：</span>
        <el-slider style="width: 200px" v-model="zoom" :min="1" :max="80"/>
      </div>
    </div>
    <div class="demo-block">
      <hd-progress 
        :zoom="zoom"
        :enable-range-select="enableRang" 
        :playList="playList" 
        :start-time="playList[0].startTimestamp" 
        :end-time="playList[playList.length - 1].endTimestamp"
        @seekTo="seekTo" 
        @timeRangChange="onSelectedTimeRangeChange" 
      />
    </div>
  </div>
</template>

<script>

const playList = [
  {
    startTime: '2019-04-07T14:37:20',
    endTime: '2019-04-07T14:52:37',
    startTimestamp: new Date('2019-05-19 10:05:51').getTime(),
    endTimestamp: new Date('2019-05-19 10:06:58').getTime()
  },
  {
    startTime: '2019-04-07T14:52:37',
    endTime: '2019-04-07T15:27:45',
    startTimestamp: new Date('2019-05-19 10:29:29').getTime(),
    endTimestamp: new Date('2019-05-19 10:30:31').getTime()
  },
  {
    startTime: '2019-04-07T15:45:00',
    endTime: '2019-04-07T15:45:00',
    startTimestamp: new Date('2019-05-19 10:31:53').getTime(),
    endTimestamp: new Date('2019-05-19 10:35:35').getTime()
  },
  {
    startTime: '2019-04-07T17:09:55',
    endTime: '2019-04-07T17:27:48',
    startTimestamp: new Date('2019-05-19 10:38:22').getTime(),
    endTimestamp: new Date('2019-05-19 23:59:59').getTime()
  }
]

export default {
  data() {
    return {
      zoom: 10,
      enableRang: false,
      playList,
      range: null
    }
  },
  mounted() {
  },
  methods: {
    seekTo(timeStamp) {
      this.$message.success(`点击进度条${timeStamp}`)
      console.log('点击进度条: ', timeStamp)
    },
    onSelectedTimeRangeChange(rangTime) {
      this.range = rangTime
      console.log('选择范围: ', rangTime)
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |                        说明                         |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------|---------|--------|--------|
| config        | 播放进度条配置                               | Object  |        |    |
| zoom        | 缩放倍数                                   | Number  |        |   10 |
| enableRangeSelect  | 是启动浮标选择                      | Boolean  |        |  false |
| currentTime   | 当前播放进度                      | Number  |        |  0 |
| playList      | 播放列表                            | Array  |        |   |
| startTime     | 刻度的开始时间                            | Number  |        |  |
| endTime       | 刻度的结束时间                            | Number  |        |  |

### Methods
|     方法名         |   说明   | 
|--------------------|--------------|
| seekTo             | 点击进度条触发的方法  |
| onSelectedTimeRangeChange | 范围选择触发的方法 | 