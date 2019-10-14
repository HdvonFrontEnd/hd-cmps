import '@babel/polyfill'
import HdImagePreview from './src/hd-image-preview.vue'

HdImagePreview.install = function(Vue): void {
  Vue.component('HdImagePreview', HdImagePreview)
}

export default HdImagePreview
