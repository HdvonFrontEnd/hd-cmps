<template>
	<div class="hd-search-select-wrapper" ref="wrapper">
    <el-popover
      v-model="selectPanelVisible"
      popper-class="hd-search-select-popper"
      :width="popoverWidth"
      transition="el-zoom-in-top"
      placement="bottom"
      trigger="click">
      <el-input
        class="select-input"
        v-bind="$attrs"
        slot="reference"
        :placeholder="!checkedList.length ? placeholder : ''"
        @mouseenter.native="$_onInputHover('enter')"
        @mouseleave.native="$_onInputHover('leave')"
        readonly>
        <hd-tags
          slot="prefix"
          ref="hdTags"
          v-bind="$_tagAttrsCombine()"
          :disabled="disabled"
          :checkedList="checkedList"
          v-if="checkedList.length"
          @close="$_tagClose"></hd-tags>
        <i v-show="showClear" slot="suffix" class="el-input__icon el-icon-circle-close" @click.stop="$_clearChecked"></i>
        <i v-show="!showClear" slot="suffix" :class="['el-input__icon', 'el-icon-arrow-down', selectPanelVisible ? 'select-icon-reverse' : '']"></i>
      </el-input>
      <!--弹出框-->
      <div class="select-panel">
        <!--搜索框-->
        <el-input v-bind="$attrs" class="select-panel__search-input" v-model="searchKeyWord" clearable>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!--列表-->
        <el-scrollbar class="select-panel__scrollbar" tag="div">
          <!--已选列表-->
          <div class="select-panel__selection-list--wrapper" v-show="searchKeyWord.length === 0">
            <div class="selection-list__checked-list">
              <el-checkbox-group
                class="selection-list__checkbox-group"
                v-model="checkedListModel">
                <el-checkbox
                  class="selection-list__checkbox"
                  v-for="item in checkedList"
                  :label="item.key"
                  :key="item.key"
                  @change="$_handleCheckChange($event, item.key)">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <!--全选按钮-->
            <el-checkbox
              class="selection-list__select-all"
              :indeterminate="isIndeterminate"
              v-model="isAllChecked"
              @change="$_handleCheckAllChange">全选</el-checkbox>
            <!--未选列表-->
            <div class="selection-list__unchecked-list">
              <el-checkbox-group
                class="selection-list__checkbox-group"
                v-model="uncheckedListModel">
                <el-checkbox
                  class="selection-list__checkbox"
                  v-for="item in uncheckedList"
                  :label="item.key"
                  :key="item.key"
                  @change="$_handleCheckChange($event, item.key)">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <!--搜索结果列表-->
          <div class="select-panel__selection-search" v-show="searchKeyWord.length > 0">
            <el-checkbox-group
              v-model="checkedListModel"
              class="selection-list__checkbox-group">
              <el-checkbox
                class="selection-list__checkbox"
                v-for="item in searchList"
                :label="item.key"
                :key="item.key"
                @change="$_handleCheckChange($event, item.key)">{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import HdTags from './hd-tags'
import { Component, Prop, Ref, Watch } from 'vue-property-decorator'
// eslint-disable-next-line no-unused-vars
import { CheckedItem, TagAttrs } from '../model'
import MouseHoverMixin from 'src/mixins/mouse-hover'
import { HdCmpsComponent } from '../../../../types/component'

@Component({ name: 'hd-search-select', components: { HdTags }, mixins: [MouseHoverMixin] })
export default class HdSearchSelect extends HdCmpsComponent {
    // 初始值
    @Prop(Array) readonly value: CheckedItem[]
    // 选项列表
    @Prop({ type: Array, default: () => ([]) }) readonly optionList: CheckedItem[]
    // 选项列表
    @Prop({ type: String }) readonly placeholder!: string
    // 是否可清空
    @Prop({ type: Boolean, default: true }) readonly clearable!: boolean
    // tag的属性
    @Prop({ type: Object }) readonly tagAttrs!: TagAttrs | undefined
    // 是否禁用
    @Prop({ type: Boolean }) readonly disabled!: boolean|undefined

    selectPanelVisible= false
    searchKeyWord= ''
    popoverWidth = 300
    checkedList: CheckedItem[] = []
    uncheckedList: CheckedItem[] = []
    checkedListModel: CheckedItem[] = []
    uncheckedListModel: CheckedItem[] = []
    searchList: CheckedItem[] = []

    // v-model绑定计算属性，不规范但是可行
    get isAllChecked(): boolean {
      return this.checkedList.length !== 0 && this.uncheckedList.length === 0
    }

    // 去除vue的警告：不存在setter
    set isAllChecked(v) {}

    get isIndeterminate(): boolean {
      return this.uncheckedList.length > 0 && this.checkedList.length !== 0
    }
    // 是否显示清除按钮
    get showClear(): boolean|number {
      return this.clearable && this.isHover && this.checkedList.length
    }

    @Watch('searchKeyWord')
    onSearchKeyWordChanged(newVal) {
      const reg = new RegExp(`${newVal}`, 'i')
      const checked = this.checkedList.filter(item => reg.test(item.label))
      const unchecked = this.uncheckedList.filter(item => reg.test(item.label))
      this.searchList = checked.concat(unchecked)
    }
    @Watch('checkedListModel')
    onCheckedListModelChanged(newVal) {
      this.$emit('input', newVal)
    }
    @Watch('value')
    onValueChanged(newVal) {
      this.$_updateListStatus()
    }
    @Watch('optionList')
    onOptionListChanged() {
      this.$_updateListStatus()
    }

    @Ref('wrapper') readonly wrapper!: HTMLDivElement

    public mounted() {
      this.$_updateListStatus()
      this.popoverWidth = this.wrapper.getBoundingClientRect().width // 设置宽度
    }

    /**
     * 响应传入值的变化
     * 根据传入的model值，更改内部model以及两个列表的数据
     */
    $_updateListStatus(): void{
      this.checkedList = []
      this.uncheckedList = []
      this.checkedListModel = this.value
      this.optionList.forEach(item => {
        if (Array.isArray(this.value) && this.value.includes(item.key)) {
          this.checkedList.push(item)
        } else {
          this.uncheckedList.push(item)
        }
      })
    }
    /**
     * 响应某项的选中状态切换
     * @param checkStatus
     * @param key
     */
    $_handleCheckChange(checkStatus, key): void {
      if (checkStatus) {
        // 如果选中则从未选中列表移到选中列表
        this.$_swap(this.uncheckedList, this.checkedList, key)
      } else {
        // 否则从选中列表移动到未选中列表
        this.$_swap(this.checkedList, this.uncheckedList, key)
      }
    }
    $_handleCheckAllChange(value): void {
      if (value) {
        this.checkedList = this.uncheckedList.concat(this.checkedList)
        this.uncheckedList = []
      } else {
        this.uncheckedList = this.checkedList.concat(this.uncheckedList)
        this.checkedList = []
      }
      this.$_resetModel()
    }
    /**
     * 交换选中列表与未选中列表中的某项
     * @param sourceList
     * @param targetList
     * @param key
     */
    $_swap(sourceList, targetList, key): void {
      const targetIdx = sourceList.findIndex(item => item.key === key)
      if (targetIdx !== -1) {
        const target = sourceList.splice(targetIdx, 1)[0]
        targetList.unshift(JSON.parse(JSON.stringify(target)))
        this.$_resetModel()
      }
    }
    /**
     * 重置model，确保表单数据正确
     */
    $_resetModel(): void {
      // 选中列表的model应包含列表中的所有值
      this.checkedListModel = this.checkedList.map(item => item.key)
      // 未选中列表的model应永远为空
      this.uncheckedListModel = []
    }
    /**
     * 清空已选
     */
    $_clearChecked(): void {
      this.checkedList = []
      this.$_resetModel()
    }
    /**
     * 关闭已选tag
     */
    $_tagClose(item): void {
      this.$_handleCheckChange(false, item.key)
    }
    /**
     * 计算出最后的属性
     */
    $_tagAttrsCombine(): TagAttrs {
      const defaultTagAttrs: TagAttrs = {}
      defaultTagAttrs.size = 'mini'
      if (this.$refs.wrapper) {
        const inputWidth = this.wrapper.offsetWidth
        defaultTagAttrs.maxWidth = inputWidth - 40
        if (this.checkedList.length > 1) {
          defaultTagAttrs.maxWidth = inputWidth - 70
          defaultTagAttrs.limitLength = 1
        }
      }
      return {
        ...defaultTagAttrs,
        ...this.tagAttrs
      }
    }
}

</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.hd-search-select-wrapper {
    .select-input {
      /deep/ .el-input__inner {
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .select-icon-reverse {
        transform: rotateZ(-180deg);
      }
    }
    .el-icon-circle-close {
      cursor: pointer;
    }
	}
</style>
<style ref="stylesheet/scss" lang="scss">
  /*弹出框样式*/
  .hd-search-select-popper {
    .popper__arrow {
      left: 12px !important;
    }
    .select-panel {
      width: 100%;
      .selection-list__select-all {
        margin-bottom: 10px;
      }
      .selection-list__checked-list {
        position: relative;
        padding-bottom: 24px;
        &:after {
          content: "";
          position: absolute;
          display: block;
          left: 20px;
          right: 20px;
          bottom: 12px;
          height: 1px;
          background: #e4e7ed;
        }
      }
      .select-panel__scrollbar {
        height: 200px;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
      .select-panel__search-input {
        margin-bottom: 10px;
      }
      .selection-list__checkbox-group {
        display: flex;
        flex-direction: column;
      }
      .selection-list__checkbox {
        margin-left: 0;
      }
    }
  }
</style>
