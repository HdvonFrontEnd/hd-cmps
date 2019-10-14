import '@babel/polyfill'
import HdSearch from './src/hd-search.vue'

HdSearch.install = function(Vue): void {
  Vue.component('HdSearch', HdSearch)
}

export default HdSearch
