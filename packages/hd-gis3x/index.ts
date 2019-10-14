import '@babel/polyfill'
import HdGis3X from './src/hd-gis3x.vue'

HdGis3X.install = function(Vue): void {
  Vue.component('hd-gis3x', HdGis3X)
}

export default HdGis3X
