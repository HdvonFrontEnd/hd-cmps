
## gis4x

使用arcgis4.10版本生成一个地图

:::tip
需要配合gis服务使用。
:::

### 基本用法
:::demo arcGis4x基本用法, 详细用法请参照代码。
```html
<template>
  <div class="mapWrapper">
    <div id="map4x" style="height: 400px; position: relative"></div>
    <el-button @click="initMap">显示地图</el-button>
    <hd-gis4x
      ref="arcGis4x"
      :gisURL="gisApiURL"
      :mapCss="mapCss"
      :gisServerPath="gisServerPath"
      @initCompleted=initCompleted></hd-gis4x>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arcGis: {},
      mapCss: 'gis/arcGIS/4.10/esri/css/main.css',
      gisApiURL: 'gis/arcGIS/4.10/main.js',
      gisServerPath: 'gis/arcGIS'
    }
  },

  mounted() {
  },

  methods: {
    initCompleted(data) {
      this.arcGis = data
    },

    initMap() {
      this.arcGis.initMap('map4x', {
        point: {
          longitude: 113.3221,
          latitude: 23.1631
        },
        zoom: 12,
        url: 'gis/gisMapServer'
      })
    }
  }
}
</script>
```
:::

### 组件使用说明

1 引入组件之后传入参数并接收initCompleted方法，该方法在组件初始化完成之后会调用

    eg: @initCompleted = initCompleted

2 在组件初始化完成之后获取返回的数据
 
    eg: this.arcGis = data


