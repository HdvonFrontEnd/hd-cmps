import '@babel/polyfill'
import HdVideoPlayback from './src/hd-video-playback.vue'

HdVideoPlayback.install = function(Vue) {
  Vue.component('HdVideoPlayback', HdVideoPlayback)
}

export default HdVideoPlayback
