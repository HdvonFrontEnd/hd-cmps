import '@babel/polyfill'
import HdChart from './src/hd-chart.vue'

HdChart.install = function(Vue) {
  Vue.component('HdChart', HdChart)
}

export default HdChart
