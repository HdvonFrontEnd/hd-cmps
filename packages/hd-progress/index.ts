import '@babel/polyfill'
import HdProgress from './src/hd-progress.vue'

HdProgress.install = function(Vue): void {
  Vue.component('HdProgress', HdProgress)
}

export default HdProgress
