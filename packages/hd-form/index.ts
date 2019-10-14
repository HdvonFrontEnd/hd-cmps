import '@babel/polyfill'
import HdForm from './src/hd-form.vue'

HdForm.install = function(Vue) {
  Vue.component('HdForm', HdForm)
}

export default HdForm
