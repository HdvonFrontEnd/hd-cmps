<template>
    <el-tag class="hd-tag" :style="style" v-bind="$attrs" v-on="$listeners">
      <span class="hd-tag-text"><slot></slot></span>
    </el-tag>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { HdCmpsComponent } from 'types/component'

@Component({ name: 'tag' })
export default class Tag extends HdCmpsComponent {
  // 最大宽度
  @Prop(Number) readonly maxWidth!: number|undefined

  get style(): object {
    if (this.maxWidth === undefined) return {}
    return { maxWidth: this.maxWidth + 'px' }
  }
}
</script>

<style lang="scss" scoped>
.hd-tag{
  display: flex;
  flex-flow: row;
  align-items: baseline;
  .hd-tag-text{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    display: block;
  }
  /deep/.el-tag__close {
    &.el-icon-close{
      top: 0;
    }
  }
}
</style>
