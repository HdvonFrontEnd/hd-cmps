import '@babel/polyfill'
import HdCron from './src/hd-cron.vue'

HdCron.install = function(Vue): void {
  Vue.component('HdCron', HdCron)
}

export default HdCron
