## chart 图表

chart 图表

### 基础用法
:::demo 
```html
<template>
  <hd-chart
    style="width: 800px; height: 300px"
    :chartType="chartType"
    :customOption="option"
  ></hd-chart>
</template>

<script>
export default {
  data() {
    return {
      chartType: 'bar',
      option: {
        dataset: {
          source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
          ]
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
    }
  }
}
</script>
```
:::


### Attributes
|      参数     |                        说明                         |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------|---------|--------|--------|
| chartType     | 图表类型                              | String  |  bar/barHorizontal/line/pie/ring      |    |
| customOption  | 图表配置项,详细配置请参照[e-charts官网](https://echarts.baidu.com/api.html#echarts)                                    | Object  |        |    |
| componentList  | 组成列表                                  | Array  |        |  ['tooltip', 'legend', 'xAxis', 'yAxis', 'grid', 'toolbox']  |
| autoResize  | 容器改变之后重新绘制                      | Boolean  |        | true   |
