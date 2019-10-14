<template>
  <div class="hd-search-more-wrapper">
    <el-popover
      v-model="selectPanelVisible"
      transition="el-zoom-in-top"
      popper-class="select-panel"
      placement="bottom"
      :width="popWidth"
      trigger="click">
      <el-button type="primary" v-bind="$attrs" slot="reference">更多</el-button>
      <!--弹出框-->
      <div
        :class="['select-panel-item', localSelectedOption.includes(item.key) ? 'selected' : '']"
        v-for="item in searchOptionList"
        :key="item.key"
        @click="onItemClick(item.key)">
        {{item.label}}
        <i class="select-panel-icon el-icon-check"></i>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Model, Vue } from 'vue-property-decorator'

@Component({
  name: 'hd-search-more'
})
export default class HdSearchMore extends Vue {
  // ============ Model ============
  @Model('updateSelected', { type: Array, default: () => ([]) }) selectedOption!: []

  // ============ Props ============
  // 宽度
  @Prop({ type: [Number, String], default: 200 }) popWidth: string | number
  // 搜索选项列表
  @Prop({ type: Array, default: () => ([]) }) searchOptionList: []

  // ============ data ============
  selectPanelVisible = false

  // ============ Computed ============
  get localSelectedOption() {
    return JSON.parse(JSON.stringify(this.selectedOption)) // 解除与props的直接联系
  }
  set localSelectedOption(val) {
    this.$emit('updateSelected', val)
  }

  // ============ methods ============
  onItemClick(itemValue): void {
    const idx = this.localSelectedOption.findIndex(item => item === itemValue)
    if (idx !== -1) {
      this.localSelectedOption.splice(idx, 1)
    } else {
      this.localSelectedOption.push(itemValue)
    }
    this.localSelectedOption = JSON.parse(JSON.stringify(this.localSelectedOption)) // 触发setter
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .hd-search-more-wrapper {
  }
</style>
<style ref="stylesheet/scss" lang="scss">
  .select-panel {
    padding: 6px 0 !important;
    .select-panel-item {
      color: #606266;
      background-color: #fff;
      font-size: 14px;
      padding: 0 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 34px;
      line-height: 34px;
      cursor: pointer;
      box-sizing: border-box;
      &:hover {
        background-color: #f5f7fa;
      }
      .select-panel-icon {
        display: none;
      }
      &.selected {
        color: #409eff;
        font-weight: 700;
        position: relative;
        .select-panel-icon {
          display: block;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 20px;
          font-size: 12px;
          font-weight: 700;
          -webkit-font-smoothing: antialiased;
        }
      }
    }
  }
</style>
