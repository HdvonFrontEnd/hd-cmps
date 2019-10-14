import '@babel/polyfill'
import HdCloudCtrl from './src/hd-cloud-ctrl.vue'

HdCloudCtrl.install = function(Vue): void {
  Vue.component('HdCloudCtrl', HdCloudCtrl)
}

export default HdCloudCtrl
