import '@babel/polyfill'
import HdEditor from './src/hd-editor.vue'

HdEditor.install = function(Vue): void {
  Vue.component('HdEditor', HdEditor)
}

export default HdEditor
