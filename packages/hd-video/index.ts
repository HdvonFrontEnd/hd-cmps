import '@babel/polyfill'
import HdVideo from './src/hd-video.vue'

HdVideo.install = function(Vue) {
  Vue.component('HdVideo', HdVideo)
}

export default HdVideo
