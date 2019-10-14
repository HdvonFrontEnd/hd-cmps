
## gis3x

使用arcgis3.24版本生成一个地图。

:::tip
需要配合gis服务使用。
:::

### 基本用法
:::demo arcGis3x基本用法, 详细用法请参照代码。
```html
<template>
  <div class="mapWrapper">
    <div id="map3x" style="height: 400px"></div>
    <el-button @click="initMap">显示地图</el-button>
    <hd-gis3x
      ref="arcGis3x"
      :gisURL="gisApiURL"
      :mapCss="mapCss"
      :gisServerPath="gisServerPath"
      @initCompleted="initCompleted"
    ></hd-gis3x>
  </div>
</template>
<script>
export default {
  data() {
    return {
      arcGis: {},
      mapCss: 'gis/arcGIS/3.24/esri/css/esri.css',
      gisApiURL: 'gis/arcGIS/3.24/main.js',
      gisServerPath: 'gis/arcGIS'
    }
  },

  methods: {
    initCompleted() {
      this.arcGis = this.$refs.arcGis3x
    },
    initMap() {
      this.arcGis.initMap('map3x', {
        point: {
          longitude: 113.3221,
          latitude: 23.1631
        },
        zoom: 12,
        url: 'gis/gisMapServer'
      }, this.initMapCompleted)
    },

    initMapCompleted() {
      console.log('加载完成')
    }
  }
}
</script>
```
:::

### 组件使用说明

1 引入组件之后传入参数并接收initCompleted方法，该方法在组件初始化完成之后会调用

    eg: @initCompleted = initCompleted

2 在组件初始化完成之后获取组件中的arcGis3x属性 
 
    eg: this.arcGis = this.$refs.arcGis3x
    
3 在使用地图事件功能时调用相应的事件方法并接收回调,回调名为: 事件名+"Cal"

    eg : this.mouseMove()
        @mouseMoveCal = mouseMoveCal



### Attributes
|      参数     |                                           说明                                      |   类型  | 可选值 | 默认值 |
|---------------|-------------------------------------------------------------------------------------|---------|--------|--------|
| mapCss        | 远程代码库的css入口                                                                 | String  |        |  http://192.168.2.36:83/arcGIS/3.24/esri/css/esri.css  |
| gisURL        | 远程代码库的js入口                                                                  | String  | ——   |  http://192.168.2.36:83/arcGis3.24/3.24/main.js   |
| gisServerPath | 远程代码库的项目地址                                                                | String  | ——   |  http://192.168.2.36:83/arcGis3.24   |
| MapService     | 地图图片服务的地址                                                                 | String  | ——   |  http://192.168.2.36:6080/arcgis/rest/services//gzmap18wz/MapServer   |
| GeometryService | 计算辐射的服务地址                                                                | String  | ——   |   |
| position        | 地图容器距离左上角的相对位置                                                      | String  | ——   |    |

### Methods
|      参数         |                                           说明                                      |
|-------------------|-------------------------------------------------------------------------------------|
| initMap           | 初始化地图                                                                         |
| extentChange      | 获取当前地图的信息                                                                | 
| setZoom           | 设置层级                                                                | 
| mouseMove         | 监听鼠标移动事件                                                                 | 
| mouseDragEnd      | 拖拽结束事件                                                            | 
| overviewMap       | 生成销毁鹰眼图                                                      |
| overviewMapShow   | 开启关闭鹰眼图                                                 |
| mercator2LatLng   | 墨卡托坐标转换成经纬度                                                 |
| latLng2Mercator   | 经纬度转墨卡托                                                 |
| locateByLatLng    | 根据经纬度定位                                                 |
| getDistance       | 计算两个点之间的距离                                                 |
| getArea           | 计算面积                                                 |
| getClusteringData | 聚合计算                                                 |
| pointClustering   | 生成聚合点                                                 |
| mapClick          | 增加点击地图的回调事件                                                 |
| addPointSymbol    | 增加一个点的symbol                                                 |
| addTextSymbol     | 增加一个文字的symbol                                                 |
| addBackgroundTextSymbol  | 增加一个有背景的文字的symbol                                                 |
| addLineSymbol     | 增加一个线的symbol                                            |
| addAreaSymbol     | 增加一个面的symbol                                            |
| deleteSymbol      | 删除symbol                                            |
| removeLayer       | 删除layer                                            |
| changeSymbol      | 更改样式                                            |
| drawALine         | 画一条线                                            |
| ranging           | 测距功能                                            |
| drawACircle       | 画一个圆                                            |
| drawAnExtentBox   | 画一个矩形                                            |
| drawAPolygon      | 画一个多边形                                            |
| cleanToolbar      | 清除绘制状态                                            |
| getRangByPoint    | 获取某个点周围的范围                                            |
| drawLineBuffer    | 画一个具有辐射的线                                            |
| showLineBuffer    | 生成一个具有辐射的线                                            |
| infoWindows       | infoWindows                                            |
| inside            | 判断是否在多边形内                                            |
| coordinateTrans   | 坐标系转换                                            |

