import '@babel/polyfill'
import HdHeadNavBar from './src/hd-head-nav-bar.vue'

HdHeadNavBar.install = function(Vue): void {
  Vue.component('HdHeadNavBar', HdHeadNavBar)
}

export default HdHeadNavBar
