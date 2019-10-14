import '@babel/polyfill'
import HdCalendar from './src/hd-calendar.vue'

HdCalendar.install = function(Vue): void {
  Vue.component('HdCalendar', HdCalendar)
}

export default HdCalendar
