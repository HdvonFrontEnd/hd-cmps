<template>
  <div class="hd-tags-container" ref="wrapper">
    <tag
      class="hd-tags"
      disable-transitions
      :closable="closable"
      v-bind="$attrs"
      v-for="(item,i) in selectedList"
      @click="handleEvent('click', item)"
      @close="handleEvent('close', item)"
      :maxWidth="maxWidth"
      :key="item.key">{{item.label}}</tag>
    <el-popover v-bind="popoverAttrsValue">
      <div class="hd-tags__popover__hidden-list" v-for="(item,i) in hiddenList">{{item.label}}</div>
      <tag class="hd-sub-tag" slot="reference" v-bind="$attrs" v-if="isShowSubTag">{{`+${checkedList.length - limitLength}`}}</tag>
    </el-popover>
  </div>
</template>

<script lang="ts">
  import tag from 'src/components/tag'
  import { Component, Prop } from 'vue-property-decorator'
  import { HdCmpsComponent } from '../../../../types/component'
  // eslint-disable-next-line no-unused-vars
  import { CheckedItem } from '../model'

  @Component({ name: 'hd-tags', components: { tag } })
  export default class HdTags extends HdCmpsComponent {
      // 选中的项
      @Prop({ type: Array, default: () => [] }) readonly checkedList!: Array<CheckedItem>
      // tag的最大出现数
      @Prop({ type: Number, default: 1 }) readonly limitLength!: number
      // tag的最大宽度, 文本超出出现省略号
      @Prop(Number) readonly maxWidth!: number
      // 是否出现 +n tag
      @Prop({ type: Boolean, default: true }) readonly isEllipsis!: boolean
      // 调整弹出框的属性
      @Prop({ type: Object, default: () => {} }) readonly popoverAttrs!: object
      // 是否禁用
      @Prop({ type: Boolean, default: false }) readonly disabled!: boolean

      get popoverAttrsValue(): object {
        // 弹出框的默认配置
        const defaultValue = {
          placement: 'right-start',
          disabled: true,
          trigger: 'hover' // click/focus/hover/manual
        }
        return { ...defaultValue, ...this.popoverAttrs }
      }

      get selectedList(): Array<CheckedItem> {
        if (!this.isEllipsis) return this.checkedList
        const checkedList = [...this.checkedList]
        if (this.limitLength && this.limitLength < checkedList.length) {
          checkedList.length = this.limitLength
          return checkedList
        }
        return checkedList.filter((v, i) => {
          if (i <= this.limitLength) return v
        })
      }

      // 是否显示+n框
      get isShowSubTag(): boolean {
        if (!this.isEllipsis) return false
        if (this.checkedList.length < this.limitLength) return false // 选中数量比限制的少
        if (this.limitLength && (this.checkedList.length - this.limitLength > 0)) return true
        return false
      }

      get hiddenList(): Array<CheckedItem> {
        const checkedList = [...this.checkedList]
        checkedList.splice(0, this.limitLength)
        return checkedList
      }

      get closable() {
        return !this.disabled
      }

      handleEvent(event, val) {
        this.$emit(event, val)
      }
  }
</script>

<style lang="scss" scoped>
.hd-tags-container {
  height: 100%;
  display: flex;
  flex-flow: row;
  align-items: center;
  .hd-tags{
    min-width: 40px;
    margin-right: 2px;
  }
  .hd-tags__popover__hidden-list:nth-last-child(1){
    margin-bottom: 1px;
  }
  .hd-sub-tag{
    z-index: 9;
  }
}
</style>
