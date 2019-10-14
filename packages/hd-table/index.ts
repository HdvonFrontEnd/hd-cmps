import '@babel/polyfill'
import HdTable from './src/hd-table.vue'

HdTable.install = function(Vue): void {
  Vue.component('HdTable', HdTable)
}

export default HdTable
