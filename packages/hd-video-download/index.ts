import '@babel/polyfill'
import HdVideoDownload from './src/hd-video-download.vue'

HdVideoDownload.install = function(Vue) {
  Vue.component('HdVideoDownload', HdVideoDownload)
}

export default HdVideoDownload
