import '@babel/polyfill'
import HdEditorReader from './src/hd-editor-reader.vue'

HdEditorReader.install = function(Vue): void {
  Vue.component('HdEditorReader', HdEditorReader)
}

export default HdEditorReader
