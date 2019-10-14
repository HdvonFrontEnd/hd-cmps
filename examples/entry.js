import '@babel/polyfill'
import Vue from 'vue'
import App from './app'
import router from './router'
import DemoBlock from './components/demo-block'
import HdCmps from 'src/index.js'
import ElementUI from 'element-ui'
import hljs from 'highlight.js'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import MyWebsocket from 'hd-websocket'
import { genUUID } from 'src/utils/utils'
import { formatTime } from 'src/utils/date.js'

Vue.use(ElementUI)
Vue.use(HdCmps)
Vue.component('demo-block', DemoBlock)

Vue.prototype.$websocket = MyWebsocket
Vue.prototype.$genUUID = genUUID
Vue.prototype.$formatTime = formatTime

Vue.config.productionTip = false

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)')
    Array.prototype.forEach.call(blocks, hljs.highlightBlock)
  })
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
