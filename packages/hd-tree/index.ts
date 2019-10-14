import '@babel/polyfill'
import HdTree from './src/hd-tree.vue'

HdTree.install = function(Vue): void {
  Vue.component('HdTree', HdTree)
}

export default HdTree
