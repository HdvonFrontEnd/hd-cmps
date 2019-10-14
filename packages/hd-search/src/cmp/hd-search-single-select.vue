<template>
	<div class="hd-search-single-select-wrapper" ref="wrapper">
    <el-popover
      v-model="singleSelectPanelVisible"
      popper-class="hd-search-single-select-popper"
      :width="popoverWidth"
      transition="el-zoom-in-top"
      placement="bottom"
      trigger="click">
      <el-input
        class="select-input"
        v-bind="$attrs"
        slot="reference"
        :placeholder="!selectedItem ? placeholder : ''"
        @mouseenter.native="$_onInputHover('enter')"
        @mouseleave.native="$_onInputHover('leave')"
        readonly>
        <hd-tags v-bind="tagAttrs" :disabled="disabled" slot="prefix" size="mini" :checkedList="selectItemArr" v-if="selectItemArr && selectItemArr.length" @close="$_clearSelection"></hd-tags>
        <i v-show="showClear" slot="suffix" class="el-input__icon el-icon-circle-close" @click.stop="$_clearSelection"></i>
        <i v-show="!showClear" slot="suffix" :class="['el-input__icon', 'el-icon-arrow-down', singleSelectPanelVisible ? 'select-icon-reverse' : '']"></i>
      </el-input>
      <!--弹出框-->
      <div class="select-panel">
        <!--搜索框-->
        <el-input v-bind="$attrs" class="select-panel__search-input" v-model="searchKeyWord" clearable>
          <i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <!--列表-->
        <el-scrollbar class="select-panel__scrollbar" tag="div">
          <!--备选列表-->
          <div v-show="searchKeyWord.length === 0">
            <el-radio-group v-model="selectedItem" class="radio-list">
              <el-radio class="radio-list__item" v-for="item in localOptionList" :label="item.key" :key="item.key">{{item.label}}</el-radio>
            </el-radio-group>
          </div>
          <!--搜索结果列表-->
          <div v-show="searchKeyWord.length > 0">
            <el-radio-group v-model="selectedItem" class="radio-list">
              <el-radio class="radio-list__item" v-for="item in searchResultOptionList" :label="item.key" :key="item.key">{{item.label}}</el-radio>
            </el-radio-group>
          </div>
        </el-scrollbar>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts">
import HdTags from './hd-tags'
import { Component, Prop, Ref, Watch } from 'vue-property-decorator'
import { HdCmpsComponent } from '../../../../types/component'
// eslint-disable-next-line no-unused-vars
import { ConditionItem } from '../model'
import MouseHoverMixin from 'src/mixins/mouse-hover'

@Component({ name: 'hd-search-single-select', mixins: [MouseHoverMixin], components: { HdTags } })
export default class HdSearchSingleSelect extends HdCmpsComponent {
    // 初始值
    @Prop([String, Boolean, Number]) readonly value!: string | boolean | number | undefined
    // 选项列表
    @Prop({ type: Array, default: () => [] }) readonly optionList!: Array<ConditionItem>
    // 占位文字
    @Prop({ type: String, default: '全部' }) readonly placeholder!: string
    // 是否可以清空
    @Prop({ type: Boolean, default: true }) readonly clearable!: boolean
    // 是否禁用
    @Prop({}) readonly disabled!: boolean | undefined
    // tag的属性
    @Prop({}) readonly tagAttrs!: undefined | object

    singleSelectPanelVisible = false
    searchKeyWord =''
    popoverWidth = 300
    selectedItem: string | boolean | number | undefined = ''

    get selectItemArr(): Array<ConditionItem>|undefined {
      const item = this.localOptionList.find(item => item.key === this.selectedItem)
      return item && [item]
    }
    get localOptionList(): Array<ConditionItem> {
      return this.optionList
    }
    get searchResultOptionList(): Array<ConditionItem> {
      const reg = new RegExp(`${this.searchKeyWord}`, 'i')
      return this.localOptionList.filter(item => reg.test(item.label))
    }
    // 是否显示清除按钮
    get showClear(): boolean {
      return this.clearable && this.isHover && this.selectedItem !== ''
    }

    @Ref() readonly wrapper!: HTMLElement

    public mounted() {
      this.popoverWidth = this.wrapper.getBoundingClientRect().width // 设置宽度
    }

    /**
     * 清空选中项
     */
    $_clearSelection(): void {
      this.selectedItem = ''
    }

    @Watch('selectedItem')
    onSelectItemChanged(newVal): void{
      this.$emit('input', newVal)
    }

    @Watch('value', { immediate: true })
    onValueChanged(newVal: string | boolean | number | undefined): void{
      this.selectedItem = newVal
    }
}

</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.hd-search-single-select-wrapper {
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
  .hd-search-single-select-popper {
    .popper__arrow {
      left: 12px !important;
    }
    .select-panel {
      width: 100%;
      .select-panel__scrollbar {
        height: 200px;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
      .select-panel__search-input {
        margin-bottom: 10px;
      }
    }
    .radio-list {
      display: flex;
      flex-direction: column;
      .radio-list__item {
        margin-left: 0;
      }
    }
  }
</style>
