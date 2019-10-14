<!--下拉树组件-->
<template>
  <i class="iconfont" :class="[className]" :style="{'color':color}" style="margin-right: 8px" v-if="className"></i>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NodeChild } from '../models/index' //eslint-disable-line

@Component({
  name: 'TreeIcon'
})
export default class TreeIcon extends Vue {
  // 节点数据
  @Prop({ type: Object, default: () => ({}) }) nodeData: object

  // data管理
  className: string | undefined = '' // 节点icon样式类名
  color: string | undefined = '' // 节点icon样式颜色

  public mounted() {
    this.createIcon()
  }

  public createIcon(): void {
    const nodeData = this.nodeData // 传入的节点
    const attrModel: NodeChild = this.$attrs
    const rootNodeConfig: NodeChild = attrModel.root // 父节点配置
    const attrsChild: NodeChild = attrModel.children
    const childNodeConfig = attrsChild && attrsChild.nodeIcons // 子节点配置数据
    const defaultColor = attrsChild && attrsChild.nodeColor // 子节点icon默认颜色
    const rootNodeColor = rootNodeConfig.nodeColor // 父节点icon颜色(不配置默认#000)
    const rootNodeIcon = rootNodeConfig.nodeIcon // 父节点icon名称
    if (childNodeConfig) {
      childNodeConfig.forEach((item: NodeChild) => {
        for (const key in item) {
          if (nodeData[key] === item[key]) {
            this.className = item['icon']
            this.color = item['color'] ? item['color'] : defaultColor
          }
        }
        if (!this.className) {
          this.className = rootNodeIcon
          this.color = rootNodeColor
        }
      })
    }
  }
}
</script>
