<template>
  <v-chart
    class="chart"
    ref="chart"
    v-bind="$attrs"
    :autoresize="autoResize"
    :options="finalOption"
    @click="onChartClick"
  >
  </v-chart>
</template>

<script lang="ts">
import VChart from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/legendScroll' // legend滚动效果
import './config/echart-components'
import * as deepmerge from 'deepmerge'
import * as componentConfig from './config/chart-component-config'
import * as chartConfig from './config/chart-config'
import { Component, Emit, Prop, Ref } from 'vue-property-decorator'
import { HdCmpsComponent } from '../../../types/component'
// eslint-disable-next-line no-unused-vars
import * as echarts from 'echarts'

@Component({ name: 'hd-chart', components: { VChart } })
export default class HdChart extends HdCmpsComponent {
    @Prop({ type: String }) chartType: string;
    @Prop({ type: Array, default: () => ['tooltip', 'legend', 'xAxis', 'yAxis', 'grid', 'toolbox'] }) componentList: string[];
    @Prop({ type: Object, default: () => ({}) }) customOption: object;
    @Prop({ type: Boolean, default: true }) autoResize: boolean;

    @Ref() readonly chart!: HTMLElement;

    // 与component无关的默认设置，例如调色盘
    baseOption: object = { animationDuration: 1000 }

    get componentOption(): object {
      let result = {}
      this.componentList.forEach(component => {
        if (componentConfig[component]) {
          result = Object.assign({}, result, {
            [component]: componentConfig[component]
          })
        }
      })
      return result
    }

    get chartDefaultOption(): object {
      if (this.chartType && chartConfig[this.chartType]) {
        return chartConfig[this.chartType]
      } else {
        return {}
      }
    }

    get finalOption() {
      return deepmerge.all([this.componentOption, this.chartDefaultOption, this.customOption])
    }

    @Emit('chartClick')
    onChartClick(params) {
      return params
    }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .chart {
    width: 100%;
    height: 100%;
  }
</style>
