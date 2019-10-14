import '@babel/polyfill'
import HdTreeGeneral from './src/hd-tree-general.vue'

HdTreeGeneral.install = function(Vue) {
  Vue.component(HdTreeGeneral.name, HdTreeGeneral)
}

export default HdTreeGeneral
