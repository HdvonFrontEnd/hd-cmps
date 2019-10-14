<template>
  <div></div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop } from 'vue-property-decorator'
import { ArcGIS3X, GisModel } from './models/index' // eslint-disable-line

@Component({
  name: 'hd-gis3x'
})
export default class HdGis3X extends HdCmpsComponent {
  // ==================== Data ====================
  // gisCss
  @Prop({ type: String, default: '', required: true }) mapCss: string
  // gisApi文件路径
  @Prop({ type: String, default: '', required: true }) gisURL: string
  // gis服务
  @Prop({ type: String, default: '', required: true }) gisServerPath: string
  // 地图服务路径
  @Prop({ type: String, default: '' }) mapService: string
  // 辐射工具服务路径
  @Prop({ type: String, default: '' }) geometryService: string
  // 路线规划服务路径
  @Prop({ type: String, default: '' }) routeTaskService: string
  // 寻路服务路径
  @Prop({ type: String, default: '' }) findTaskService: string
  // 地图容器距离左上角的距离（单位px）
  @Prop({ type: Object, default: () => ({ x: 0, y: 0 }) }) position: {}

  // ==================== Data ====================
  gis: GisModel

  // ==================== 生命周期 ====================
  mounted() {
    this.init()
  }

  // ==================== Methods ====================
  // 初始化
  init() {
    // 如果已经加载了这个文件
    if ((window as ArcGIS3X).ArcGIS3X) {
      this.getGisApi()
    } else {
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
        (window as ArcGIS3X).gisServerPath3X = this.gisServerPath
        this.getGisApi()
      }).catch((res) => {
        this.$emit('initError', res)
      })
    }
  }
  // 将文件中的api放到这个组件中, 赋予默认值 并 通知父组件该组件已加载完成
  getGisApi() {
    (window as ArcGIS3X).ArcGIS3X((res) => {
      this.gis = res
      this.gis.mapService = this.mapService
      this.gis.geometryService = this.geometryService
      this.gis.routeTaskService = this.routeTaskService
      this.gis.findTaskService = this.findTaskService
      this.gis.position = this.position
      this.$emit('initCompleted', this.gis)
    })
  }
  /**
   * 初始化地图
   * @param id String 用来显示地图的元素id
   * @param data {Point:{}} 显示的中心点的坐标
   * @param initCompleted 初始化完成的回调
   */
  initMap(id, data, initCompleted) {
    this.gis.initMap(id, data, initCompleted)
  }
  /**
   * 获取当前地图的信息
   * 返回地图的范围，层级，层级是否改变等信息
   * 每当地图移动，缩放的时候就会返回这些参数
   */
  extentChange() {
    this.gis.subscribeEvent('extentChange', event => {
      this.$emit('extentChangeCal', event)
    })
  }
  // 设置层级
  setZoom(level) {
    this.gis.setZoom(level)
  }
  // 监听鼠标移动事件
  mouseMove() {
    this.gis.subscribeEvent('mouseMove', event => {
      this.$emit('mouseMoveCal', event)
    })
  }
  // 拖拽结束事件
  mouseDragEnd() {
    this.gis.subscribeEvent('mouseDragEnd', event => {
      this.$emit('mouseDragEnd', event)
    })
  }
  /**
   * 鹰眼图开关
   * @param flag true:生成， false:销毁
   */
  overviewMap(flag) {
    this.gis.overviewMap(flag)
  }
  /**
   * 鹰眼图开关
   * @param flag true:显示， false:隐藏
   */
  overviewMapShow(flag) {
    this.gis.overviewMapShow(flag)
  }
  /**
   * 墨卡托坐标转换成经纬度
   * @param mercator [Array] 墨卡托坐标数组的数组
   * @returns [Array] 经纬度坐标数组的数组
   */
  mercator2LatLng(mercator) {
    return this.gis.mercator2LatLng(mercator)
  }
  // 经纬度转墨卡托
  latLng2Mercator(latlng) {
    return this.gis.latLng2Mercator(latlng)
  }
  /**
   * 根据经纬度定位
   * const Obj = {longitude:Number, latitude:Number}
   * @param point Obj 要定位的点的坐标
   * @param zoom Number 定位之后的层级
   */
  locateByLatLng({ point, zoom }) {
    this.gis.locateByLatLng(point, zoom)
  }
  /**
   * 计算两个点之间的距离
   * const Obj = {longitude:Number, latitude:Number}
   * @param point1 Obj  点1的坐标
   * @param point2 Obj  点2的坐标
   * @returns Number 经纬度坐标数组的数组
   */
  getDistance(point1, point2) {
    return this.gis.getDistance(point1.latitude, point1.longitude, point2.latitude, point2.longitude)
    // this.$emit('getDistanceCal', returns)
  }
  // 计算面积
  getArea(polygon, acres) {
    return this.gis.getArea(polygon, acres)
  }
  /**
   * 聚合计算
   * 将对象数组基于密度分类
   * const Obj = {id:Number,name:String,longitude:Number, latitude:Number}
   * @param arrays [Obj] 点的数据的数组
   * @param distance Number 当前地图的层级
   * @returns [[Obj]]
   */
  getClusteringData(arrays, distance) {
    return this.gis.getClusteringData(arrays, distance)
  }
  /**
   * 生成聚合点
   * const Obj = {id:Number,name:String,longitude:Number, latitude:Number}
   * @param data [[Obj]]
   */
  pointClustering(data) {
    const pointClusteringGraphic = this.gis.pointClustering(data)
    this.gis.subscribeEvent('clusterGraphicOnclickCalFun', event => {
      this.$emit('clusterGraphicOnclickCalFun', event)
    })
    return pointClusteringGraphic
  }
  // 增加点击地图的回调事件，返回点击的event数据
  mapClick() {
    this.gis.subscribeEvent('mapClick', event => {
      this.$emit('mapClickCal', event)
    })
  }
  /**
   * 增加一个点的symbol
   * @param point / {longitude:Number,latitude:Number} symbol的位置
   * @param symbol / {url:''}  图片的地址和其它参数
   * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
   * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
   */
  addPointSymbol(point, symbol, attributes, infoTemplate) {
    return this.gis.addPointSymbol(point, symbol, attributes, infoTemplate)
  }
  /**
   * 增加一个文字的symbol
   * @param point / {longitude:Number,latitude:Number} symbol的位置
   * @param symbol / {text:''}  symbol的文字和其它参数
   * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
   * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
   */
  addTextSymbol(point, symbol, attributes, infoTemplate) {
    return this.gis.addTextSymbol(point, symbol, attributes, infoTemplate)
    // this.$emit('addTextSymbolCal', returns)
  }
  /**
   * 增加一个有背景的文字的symbol
   * @param point / {longitude:Number,latitude:Number} symbol的位置
   * @param symbol / {}  背景样式参数
   * @param textSymbol / {text:''}  symbol的文字和其它参数
   * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
   * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
   */
  addBackgroundTextSymbol(point, symbol, textSymbol, attributes, infoTemplate) {
    return this.gis.addBackgroundTextSymbol(point, symbol, textSymbol, attributes, infoTemplate)
    // this.$emit('addBackgroundTextSymbolCal', returns)
  }
  /**
   * 增加一个线的symbol
   * @param startPoint / {longitude:Number,latitude:Number} 开始点的坐标
   * @param endPoint /  {longitude:Number,latitude:Number} 结束点的坐标
   * @param symbol / {} 该线条的一些参数信息
   * @param arrow 箭头的参数，不传则不显示箭头
   */
  addLineSymbol(startPoint, endPoint, symbol, arrow) {
    return this.gis.addLineSymbol(startPoint, endPoint, symbol, arrow)
    // this.$emit('addLineSymbolCal', returns)
  }
  /**
   * 增加一个面的symbol
   * @param points / [{longitude:Number,latitude:Number}] 面的坐标的数组
   * @param symbol / {}  面的样式
   * @param attributes Object 该symbol的一些数据，在获取到这个symbol的时候会获取到这些信息
   * @param infoTemplate 鼠标放上去的弹窗信息（暂时没有用到）
   */
  addAreaSymbol(points, symbol, attributes, infoTemplate) {
    return this.gis.addAreaSymbol(points, symbol, attributes, infoTemplate)
    // this.$emit('addAreaSymbolCal', returns)
  }
  /**
   * 删除symbol
   * @param graphic 要删除的layer上的标注，不传则删除map上的
   * @param layerId
   */
  deleteSymbol(graphic, layerId) {
    this.gis.deleteSymbol(graphic, layerId)
  }
  /**
   * 删除layer
   * @param layerId 要删除的layer，不传则删除所有
   */
  removeLayer(layerId) {
    this.gis.removeLayer(layerId)
  }
  /**
   * 更改样式
   * @param graphic 需要更改的graphic
   * @param symbol 需要更改的样式
   */
  changeSymbol(graphic, symbol) {
    this.gis.changeSymbol(graphic, symbol)
  }
  /**
   * 画一条线
   * @param data symbol的样式属性
   */
  drawALine(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.drawALine((res) => {
          resolve(res)
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  // 测距功能
  ranging(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.ranging((data, distance) => {
          resolve({ type: 'ranging', data: data, distance })
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  /**
   * 画一个圆
   * @param data symbol的样式属性
   */
  drawACircle(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.drawACircle((res) => {
          resolve({ type: 'circle', data: res })
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  /**
   * 画一个矩形
   * @param data symbol的样式属性
   */
  drawAnExtentBox(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.drawAnExtentBox((res) => {
          resolve({ type: 'rectangle', data: res })
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  /**
   * 画一个多边形
   * @param data symbol的样式属性
   */
  drawAPolygon(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.drawAPolygon((res) => {
          resolve({ type: 'polygon', data: res })
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  // 清除绘制状态
  cleanToolbar() {
    this.gis.cleanToolbar()
  }
  /**
   * 获取某个点周围的范围( 根据半径选择范围 )
   * @param point / {longitude:Number,latitude:Number} 点的坐标
   * @param radius Number 半径（米）
   */
  getRangByPoint(point, radius) {
    return this.gis.getRangByPoint(point, radius)
    // this.$emit('getRangByPointCal', returns)
  }
  // 初始化路径功能
  initRoute() {
    this.gis.initRoute()
  }
  // 增加一个停靠点
  routeAddStops() {
    this.gis.routeAddStops()
  }
  // 删除停靠点
  routeClearStops() {
    this.gis.routeClearStops()
  }
  // 增加一个障碍点
  routeAddBarriers() {
    this.gis.routeAddBarriers()
  }
  // 删除障碍点
  routeClearBarriers() {
    this.gis.routeClearBarriers()
  }
  // 绘制路线
  routeSolveRoute() {
    this.gis.routeSolveRoute()
  }
  // 删除路径
  routeClearRoutes() {
    this.gis.routeClearRoutes()
  }
  // 通过路名查找路的信息
  findRoad(searchText) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.findRoad(searchText, res => {
          resolve(res)
        })
      } catch (error) {
        reject()
      }
    })
  }
  // 显示路的信息
  showResultsRoad(results) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.showResultsRoad(results, res => {
          resolve(res)
        })
      } catch (error) {
        reject()
      }
    })
  }
  /**
   * 画一个具有辐射的线
   * @param data / {distances:Number} 辐射距离和其它样式修改
   */
  drawLineBuffer(data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.drawLineBuffer((res) => {
          resolve({ type: 'line', data: res })
        }, data)
      } catch (error) {
        reject()
      }
    })
  }
  /**
   * 生成一个具有辐射的线
   * @param event 中心线的graphic
   * @param data / {distances:Number} 辐射距离和其它样式修改
   */
  showLineBuffer(event, data) {
    return new Promise((resolve, reject) => {
      try {
        this.gis.showLineBuffer(event, data, (res) => {
          resolve({ type: 'line', data: res })
        })
      } catch (error) {
        reject()
      }
    })
  }
  // infoWindows
  infoWindows(flag, data) {
    this.gis.infoWindows(flag, data)
  }
  // 判断是否在多边形内
  inside(points, point) {
    return this.gis.inside(points, point)
  }
  /**
   * 坐标系转换
   * @param type String 只支持 84to02 02to84
   * @param data [longitude,latitude]  转换前的坐标
   * @return [longitude,latitude] 转换后的坐标
   */
  coordinateTrans(type, data) {
    if (type === '84to02') {
      return this.gis.wgs84togcj02(data)
    } else if (type === '02to84') {
      return this.gis.gcj02towgs84(data)
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
