<template>
  <div></div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop } from 'vue-property-decorator'
import { ArcGIS4XModel } from './models/index' // eslint-disable-line

@Component({
  name: 'hd-gis4x'
})
export default class HdGis4X extends HdCmpsComponent {
  // ==================== Props ====================
  // gisCss
  @Prop({ type: String, default: '' }) mapCss: string
  // gisApi文件路径
  @Prop({ type: String, default: '' }) gisURL: string
  // gis服务
  @Prop({ type: String, default: '' }) gisServerPath: string
  // 地图服务路径
  @Prop({ type: String, default: '' }) MapService: string
  // 辐射工具服务路径
  @Prop({ type: String, default: '' }) GeometryService: string
  // 定位坐标
  @Prop({ type: Object, default: () => ({ x: 0, y: 0 }) }) position: {}

  // ==================== Data ====================
  arcGis: ArcGIS4XModel

  // ==================== 生命周期 ====================
  mounted() {
    this.init()
  }

  // ==================== Methods ====================
  // 初始化
  init() {
    // 获取css
    const getCss = new Promise((resolve, reject) => {
      const head = document.getElementsByTagName('head')[0]
      const mapCss = document.createElement('link')
      mapCss.href = this.mapCss
      mapCss.type = 'text/css'
      mapCss.rel = 'stylesheet'
      mapCss.onload = () => {
        resolve()
      }
      mapCss.onerror = () => {
        reject(new Error('加载地图js模块失败'))
      }
      head.appendChild(mapCss)
    })
    // 获取js
    const getScript = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = this.gisURL
      document.body.appendChild(script)
      script.onload = () => {
        resolve()
      }
      script.onerror = () => {
        reject(new Error('加载地图css模块失败'))
      }
    })
    const promiseArr = [getCss, getScript]
    Promise.all(promiseArr).then(() => {
      this.getGisApi()
    }).catch((res) => {
      this.$emit('initError', res)
    })
  }
  // 将文件中的api放到这个组件中, 赋予默认值 并 通知父组件该组件已加载完成
  getGisApi() {
    // eslint-disable-next-line
    this.arcGis = new ArcGIS4X({gisServerPath:this.gisServerPath}) 
    this._isInit()
  }
  _isInit() {
    if (this.arcGis.isInit) {
      this.$emit('initCompleted', this.arcGis)
    } else {
      setTimeout(function() {
        this._isInit()
      }.bind(this), 10)
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /*此处如果不加样式，就不会导出该组件的css文件，那么在按需引入此组件的时候就会因为找不到css文件而出错*/
  .fakeStyle {
    width: 100%;
  }
</style>
