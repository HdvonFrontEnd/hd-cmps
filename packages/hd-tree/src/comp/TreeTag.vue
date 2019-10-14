<template>
  <span>
    <el-tag
      class="hd-tag"
      v-for="(item, index) in tagList"
      :key="index"
      :type="item.tagColor"
    >{{item.tagName}}</el-tag>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NodeChild } from '../models/index' //eslint-disable-line

@Component({
  name: 'TreeTag'
})
export default class TreeTag extends Vue {
  // 节点数据
  @Prop({ type: Object, default: () => ({}) }) nodeData: object

  // data管理
  tagList: NodeChild[] = [] // 存储匹配的tag配置

  public mounted(): void {
    this.createTag()
  }

  public createTag(): void {
    const nodeData = this.nodeData // 传入的节点
    const attrModel: NodeChild = this.$attrs
    const data: NodeChild[] = attrModel.data // 节点标签配置
    if (data) {
      data.forEach(item => {
        for (const key in item) {
          if (nodeData[key] === item[key]) {
            const matchItem: NodeChild = {
              tagName: item['tagName'],
              tagColor: item['tagColor']
            }
            this.tagList.push(matchItem) // 将匹配项推入tagList
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.hd-tag {
  line-height: 18px;
  height: auto;
  margin-left: 5px;
}
</style>
