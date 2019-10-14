import '@babel/polyfill'
import HdPdfViewer from './src/hd-pdf-viewer.vue'

HdPdfViewer.install = function(Vue): void {
  Vue.component('HdPdfViewer', HdPdfViewer)
}

export default HdPdfViewer
