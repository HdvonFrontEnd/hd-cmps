<template>
  <div :class="['hd-tree-dropdown-wrapper', disabled ? 'disabled' : '']">
    <el-select
      ref="select"
      :value="checkedLabels"
      :disabled="disabled"
      :placeholder="checkedKeys.length > 0 ? '' : placeholder"
      multiple
      collapse-tags
      :clearable="clearable"
      :size="size"
      @remove-tag="onRemoveTag"
      @clear="onClear"
      @visible-change="selectPanelVisible = $event"
    >
      <div slot="empty" style="padding: 10px;">
        <hd-tree-general
          :value="value"
          @selected="onSelected"
          v-bind="myTreeAttrs"
          :inner-style="{ overflow: selectPanelVisible ? 'auto' : 'hidden' }">  <!-- 解决ie11出现横向滚动条的问题 -->
        </hd-tree-general>
      </div>
    </el-select>
  </div>
</template>
<script lang="ts">
import HdTreeGeneral from 'packages/hd-tree-general'
import { isEmpty } from 'src/utils/utils'
import { Component, Model, Prop, Ref, Emit } from 'vue-property-decorator'
import { HdCmpsComponent } from 'types/component'
import { Select } from 'element-ui' //eslint-disable-line
import { ConditionTreeAttrs, Condition } from './model/index' //eslint-disable-line
@Component({
  name: 'HdTreeDropdown',
  components: { HdTreeGeneral }
})
export default class HdTreeDropdown extends HdCmpsComponent {
  // =========== Model ============
  // 多选为数组，单选为字符串
  @Model('selected', { type: [Array, String], default: () => ([]) }) value!: string[] | string

  // =========== Props ============
  @Prop({ type: Object, default: () => ({
    type: {
      type: String,
      default: 'checkbox'
    },
    treeData: {
      type: Array,
      default: () => []
    }
  }) }) treeAttrs!: ConditionTreeAttrs
  // 是否可清除
  @Prop({ type: Boolean, default: true }) clearable !: boolean
  // 组件尺寸
  @Prop({ type: String, default: 'mini' }) size !: string
  // 控制form表单元素是否被禁用
  @Prop({ type: Boolean, default: false }) disabled !: boolean
  @Prop({ type: String, default: '请选择' }) placeholder !: string

  // ============ refs ============
  @Ref('select') readonly select!: Select
  // ============ Computed ============
  get myTreeAttrs(): ConditionTreeAttrs {
    return {
      ...{ type: 'checkbox', treeData: [] },
      ...this.treeAttrs
    }
  }

  get type(): string {
    return this.myTreeAttrs.type ? this.myTreeAttrs.type : 'checkbox'
  }

  get checkedNodes(): Condition[] {
    return this.treeAttrs.treeData.filter(v =>
      this.type === 'checkbox' ? this.value.includes(v.id) : v.id === this.value
    )
  }

  get checkedLabels(): string[] {
    const labels = this.checkedNodes.map(v => v.name)
    const [labelFirst] = labels
    // label过长用省略号代替
    if (labelFirst && this.select) {
      const rate = 0.06 // 18 / 300
      if (labelFirst.length / (this.select.$el.getBoundingClientRect().width) > rate) {
        const length = parseInt((rate * this.select.$el.getBoundingClientRect().width).toString())
        labels[0] = labelFirst.slice(0, length - 4) + '...'
      }
    }
    return labels
  }

  get checkedKeys(): string | (string | string[])[] {
    return this.type === 'checkbox'
      ? this.value
      : !isEmpty(this.value)
        ? [this.value]
        : []
  }
  // =========== data ==============
  selectPanelVisible = false

  // =========== lifeCycle ===========
  public mounted() {
    this.$nextTick(() => {
      this.updateTagStyle()
    })
  }

  // =========== Emit =============
  @Emit('selected')
  onSelected(key: string | string[] | null, data?: Condition | Condition[] | null) {
    this.$nextTick(() => {
      this.updateTagStyle()
    })
  }

  onClear() {
    if (this.disabled) return
    const key = this.type === 'checkbox' ? [] : null
    // 此时的 key跟data 一致
    this.onSelected(key, key)
    this.$emit('clearValue') // 废弃api， 请使用 'selected'
  }
  // =========== Methods ===========

  // 关闭tag标签，删除checknodes的第一个
  onRemoveTag(): void {
    if (this.disabled) return
    const key = this.type === 'checkbox' ? this.value.slice(1) : null
    this.onSelected(key)
  }

  // 改变select里面的tag为primary
  updateTagStyle(): void {
    this.select.$children.forEach(child => {
      const classNames = child.$el.classList.toString()
      if (classNames.indexOf('el-tag') > -1 && classNames.indexOf('el-tag--info') > -1) {
        child.$el.classList.remove('el-tag--info')
        child.$el.classList.add('el-tag--primary')
      }
    })
  }
}
</script>

<style lang="scss" scoped>
/deep/ .directory-tree-wrapper {
  margin-top: 10px;
  max-height: 300px;
  min-height: 100px;
  overflow: auto;
  width: 100%; // 兼容火狐
}
/deep/ .hd-select-single {
  display: block;
  .el-tag:first-child {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    max-width: 100%;
    /* 弹性布局是为了不让el-tag__close也被省略*/
    display: flex;
    flex-flow: row;
    align-items: baseline;
    .el-select__tags-text{
      display: inline-block;
      background-color: #ecf5ff;
      border-color: #d9ecff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .el-tag__close {
    &.el-icon-close {
      background: transparent;
      color: #409eff;
      right: 0;
      &:hover {
        color: #fff;
        background: #409eff;
      }
    }
  }
}
/deep/ .hd-select {
  display: block;
  .el-tag:first-child {
    background-color: #ecf5ff;
    border-color: #d9ecff;
    max-width: calc(100% - 65px);// 65px 为预估tag的最大宽度,现放宽限制防止出现换行
    /* 弹性布局是为了不让el-tag__close也被省略*/
    display: flex;
    flex-flow: row;
    align-items: baseline;
    .el-select__tags-text{
      background-color: #ecf5ff;
      border-color: #d9ecff;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .el-tag__close {
    &.el-icon-close {
      background: transparent;
      color: #409eff;
      right: 0;
      &:hover {
        color: #fff;
        background: #409eff;
      }
    }
  }
}
</style>
