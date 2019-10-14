import '@babel/polyfill'
import HdTreeDropdown from './src/hd-tree-dropdown.vue'

HdTreeDropdown.install = function(Vue): void {
  Vue.component('HdTreeDropdown', HdTreeDropdown)
}

export default HdTreeDropdown
