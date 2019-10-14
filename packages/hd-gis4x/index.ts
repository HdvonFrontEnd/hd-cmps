import '@babel/polyfill'
import HdGis4X from './src/hd-gis4x.vue'

HdGis4X.install = function(Vue): void {
  Vue.component('hd-gis4x', HdGis4X)
}

export default HdGis4X
