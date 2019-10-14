<template>
	<div class="hd-search-wrapper">
    <div class="search-top">
      <el-form
        :disabled="disabled"
        ref="form-top"
        class="search-form"
        @submit.native.prevent
        :model="formTop"
        v-bind="$attrs">
        <el-form-item
          v-for="item in localStandSearchOptionList"
          :key="item.key"
          :label-width="item.label ? item.labelWidth : '0px'"
          :label="item.label">
          <template v-if="item.type === 'radio'">
            <hd-single-search-select
              :tag-attrs="item.tagAttrs"
              :disabled="item.disabled"
              v-model="formTop[item.key]"
              :optionList="item.options"
              :placeholder="item.placeholder"
              class="search__form-item"
              :clearable="clearable"></hd-single-search-select>
          </template>
          <template v-else-if="item.type === 'input'">
            <el-input v-model="formTop[item.key]" class="search__form-item" :placeholder="item.placeholder" :clearable="clearable"></el-input>
          </template>
          <!-- 日期选择器，以后维护这个-->
          <template v-else-if="item.type === 'time'">
            <el-time-select
              :placeholder="item.placeholder"
              v-model="formTop[item.key]"
              class="search__form-item"
              v-bind="item.props"
              :clearable="clearable">
            </el-time-select>
          </template>
          <template v-else-if="item.type === 'datePicker'">
            <el-date-picker
              :placeholder="item.placeholder"
              v-model="formTop[item.key]"
              class="search__form-item"
              v-bind="item.props"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <!-- 日期选择器 end-->

          <!-- 旧版日期选择器 待废弃-->
          <template v-else-if="item.type === 'dateTime'">
            <el-date-picker
              :placeholder="item.placeholder"
              v-model="formTop[item.key]"
              class="search__form-item"
              type="datetime"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'timePicker'">
            <el-date-picker
              :placeholder="item.placeholder"
              v-model="formTop[item.key]"
              class="search__form-item"
              type="date"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'date'">
            <el-date-picker
              :placeholder="item.placeholder"
              v-model="formTop[item.key]"
              class="search__form-item"
              type="date"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <template v-else-if="item.type === 'dateTimeRange'">
            <el-date-picker
              :placeholder="item.placeholder"
              type="datetimerange"
              class="search__form-item"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              v-model="formTop[item.key]"
              :clearable="clearable">
            </el-date-picker>
          </template>
           <!-- 旧版日期选择器 待废弃 end-->
          <template v-else-if="item.type === 'slot'">
            <div class="search__form-item">
              <slot :name="item.key"></slot>
            </div>
          </template>
          <template v-else>
            <hd-search-select
              :disabled="item.disabled"
              :tag-attrs="item.tagAttrs"
              :placeholder="item.placeholder"
              class="search__form-item"
              v-model="formTop[item.key]"
              :optionList="item.options"
              v-bind="$attrs"
              :clearable="clearable">
            </hd-search-select>
          </template>
        </el-form-item>
        <el-form-item label="" :label-width="'0px'" v-show="localMoreSearchOptionList.length > 0">
          <hd-search-more v-bind="$attrs" v-model="formTop.optionList" :search-option-list="localMoreSearchOptionList"></hd-search-more>
        </el-form-item>
        <div class="search-top__btn-group">
          <el-button class="search-top__btn" @click="toSearch" v-bind="$attrs" type="primary">查询</el-button>
          <el-button class="search-top__btn" @click="$_reset" v-bind="$attrs">重置</el-button>
        </div>
      </el-form>
    </div>
    <div class="search-bottom">
      <el-form
        ref="form-bottom"
        class="search-form"
        :model="formBottom"
        @submit.native.prevent
        v-bind="$attrs">
        <el-form-item
          v-for="item in formTop.optionList"
          :key="item"
          :label-width="$_getItemByKey(localMoreSearchOptionList, item).label ? $_getItemByKey(localMoreSearchOptionList, item).labelWidth : '0px'"
          :label="$_getItemByKey(localMoreSearchOptionList, item).label">
          <template v-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'radio'">
            <hd-single-search-select
              :disabled="item.disabled"
              :tagAttrs="item.tagAttrs"
              v-model="formBottom[item]"
              :optionList="$_getItemByKey(localMoreSearchOptionList, item).options"
              :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder"
              class="search__form-item"
              :clearable="clearable"></hd-single-search-select>
          </template>
          <template v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'input'">
            <el-input v-model="formBottom[item]" class="search__form-item" :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder" :clearable="clearable"></el-input>
          </template>
          <!-- 时间日期选择器，以后维护这个-->
          <template v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'time'">
            <el-time-select
              :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder"
              v-model="formBottom[item.key]"
              class="search__form-item"
             v-bind="$_getItemByKey(localMoreSearchOptionList, item).props"
              :clearable="clearable">
            </el-time-select>
          </template>
          <template  v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'datePicker'">
            <el-date-picker
              :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder"
              v-model="formBottom[item.key]"
              class="search__form-item"
              v-bind="$_getItemByKey(localMoreSearchOptionList, item).props"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <!-- 日期选择器 end-->
          <!-- 旧版日期选择器 待废弃-->
          <template v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'dateTime'">
            <el-date-picker
              v-model="formBottom[item]"
              :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder"
              class="search__form-item"
              type="datetime"
              :clearable="clearable">
            </el-date-picker>
          </template>
          <template v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'dateTimeRange'">
            <el-date-picker
              v-model="formBottom[item]"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              class="search__form-item"
              type="datetimerange"
              :clearable="clearable">
            </el-date-picker>
            <!-- 旧版日期选择器 待废弃 end-->
          </template>
          <template v-else-if="$_getItemByKey(localMoreSearchOptionList, item).type === 'slot'">
            <div class="search__form-item">
              <slot :name="item"></slot>
            </div>
          </template>
          <template v-else>
            <hd-search-select
              :disabled="item.disabled"
              :tagAttrs="item.tagAttrs"
              class="search__form-item"
              v-model="formBottom[item]"
              :optionList="$_getItemByKey(localMoreSearchOptionList, item).options"
              :placeholder="$_getItemByKey(localMoreSearchOptionList, item).placeholder"
              v-bind="$attrs"
              :clearable="clearable">
            </hd-search-select>
          </template>
          <span class="el-icon-circle-close search__close-btn" @click="$_removeBottomCondition(item)"></span>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts">
import HdSearchSelect from './cmp/hd-search-select'
import HdSingleSearchSelect from './cmp/hd-search-single-select'
import HdSearchMore from './cmp/hd-search-more'
import { debounce } from '../../../src/utils/utils.js'
import { Component, Emit, Model, Prop, Watch } from 'vue-property-decorator'
import { HdCmpsComponent } from '../../../types/component'
// TODO eslint 报错
// eslint-disable-next-line no-unused-vars
import { ConditionFormItem, ConditionItem } from './model'

@Component({
  name: 'hd-search',
  components: {
    HdSearchSelect,
    HdSingleSearchSelect,
    HdSearchMore
  }
})
export default class HdSearch extends HdCmpsComponent {
    // ============ Model ============
    @Model('updateSearchData', { type: Object, default: () => ({}) }) searchData!: object

    // ============ Props ============
    // 条件列表
    @Prop({ type: Array, default: () => ([]) }) conditionList!: Array<ConditionItem>
    // 是否可清除
    @Prop({ type: Boolean, default: true }) clearable!: boolean
    // 是否禁用
    @Prop({ type: Boolean, default: false }) disabled!: boolean
    // tag的属性
    @Prop({ type: Object, default: () => {} }) tagAttrs!: object

    // ============ data ============
    formTop: ConditionFormItem = { optionList: [] }
    formBottom = {}

    // ============ Computed ============
    // 默认展示在界面的条件列表
    get localStandSearchOptionList(): Array<ConditionItem> {
      return this.conditionList.filter(item => item.stand)
    }
    // 更多的条件列表
    get localMoreSearchOptionList(): Array<ConditionItem> {
      return this.conditionList.filter(item => !item.stand)
    }
    // 获取已选择的更多调教列表
    get selectedMore(): string[] {
      return this.formTop.optionList
    }
    // 查询所有条件列表
    get searchCondition(): ConditionFormItem {
      const searchCondition = { ...this.formTop, ...this.formBottom }
      delete searchCondition.optionList // 删除optionList字段
      return searchCondition
    }

    // ============ Watch ============
    /**
     * 如果一个查询字段已经被取消勾选
     * 那么就将其从查询条件中删除
     */
    @Watch('selectedMore', { deep: true })
    onSelectedMoreChanged(newVal, oldVal): void {
      oldVal.forEach(key => {
        if (!newVal.includes(key)) {
          delete this.formBottom[key]
          this.$emit('removed', key)
        }
      })
    }
    // 搜索条件改变
    @Watch('searchCondition', { deep: true })
    onSearchConditionChanged(): void {
      this.hasChange()
    }
    // 搜索条件列表的数据改变
    @Watch('searchData', { deep: true, immediate: true })
    onSearchDataChanged(newVal): void {
      const searchDataKeyArr = Object.keys(newVal)
      Object.keys(this.formTop).forEach(key => {
        if (!searchDataKeyArr.includes(key) && key !== 'optionList') delete this.formTop[key] // TODO 待优化 vue不能检测到属性删除
      })
      Object.keys(this.formBottom).forEach(key => {
        if (!searchDataKeyArr.includes(key)) {
          const idx = this.formTop.optionList.findIndex(item => item === key)
          if (idx !== -1) this.formTop.optionList.splice(idx, 1)
          delete this.formBottom[key]
        }
      })
      searchDataKeyArr.forEach((name: string) => {
        if (this.localStandSearchOptionList.find(item => item.key === name)) {
          this.$set(this.formTop, name, newVal[name])
        }
        if (this.localMoreSearchOptionList.find(item => item.key === name)) {
          this.$set(this.formBottom, name, newVal[name])
          if (!this.formTop.optionList.includes(name)) this.formTop.optionList.push(name)
        }
      })
    }
    // 默认展示条件列表变动
    @Watch('localStandSearchOptionList')
    onLocalStandSearchOptionListChanged(newVal): void {
      // 条件发生变化。如果条件在formTop中有值，那么条件被移除后应该需要被清空
      // 遍历formTop，如果某一个不在localStandSearchOptionList里就移除
      const currentFormKeyArr = Object.keys(this.formTop)
      const currentStandConditionArr = newVal.map(item => item.key)
      currentFormKeyArr.forEach(key => {
        if (!currentStandConditionArr.includes(key) && key !== 'optionList') {
          this.$delete(this.formTop, key)
        }
      })
    }
    // 更多展示条件列表变动
    @Watch('localMoreSearchOptionList')
    onLocalMoreSearchOptionListChanged(newVal): void {
      // 修改formTop的optionList属性，只有仍在的条件才会保留
      // optionList被更新后会触发selectedMore的watch handler，将对应的formBottom属性删除（如果有）
      const currentStandConditionArr = newVal.map(item => item.key)
      this.formTop.optionList = this.formTop.optionList.filter(item => currentStandConditionArr.includes(item))
    }

    // ============ methods ============
    // 返回搜索条件的值
    @Emit('search')
    toSearch() {
      return this.searchCondition // 将查询条件暴露出去
    }
    // 查询条件发生变化，将最新条件暴露出去
    hasChange() {
      return debounce(() => {
        this.$emit('updateSearchData', this.searchCondition)
        this.$emit('change', this.searchCondition)
      }, 200)()
    }
    // 移除条件项
    $_removeBottomCondition(key): void {
      this.formTop.optionList = this.formTop.optionList.filter(item => {
        return item !== key
      })
    }
    // 重置条件输入
    $_reset(): void {
      Object.keys(this.formTop).forEach(key => {
        if (key !== 'optionList') {
          this.formTop[key] = undefined
        }
      })
      Object.keys(this.formBottom).forEach(key => {
        this.formBottom[key] = undefined
      })
      this.$emit('reset')
    }
    // 根据指定的key对应的条件项值
    $_getItemByKey(list: Array<ConditionItem>, key: string | number | undefined) {
      if (!Array.isArray(list)) return {}
      return list.find(item => item.key === key) || {}
    }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.hd-search-wrapper {
    width: 100%;
    padding: 10px 0;
    background-color: #fff;
    .search-top {
      width: 100%;
      display: flex;
      align-items: center;
      .search-top__btn-group {
        margin-left: 10px;
        margin-bottom: 10px;
      }
    }
    .search-bottom {
      width: 100%;
      display: flex;
      align-items: flex-start;
    }
    .search-form {
      display: flex;
      flex-wrap: wrap;
      margin-right: 10px;
      /deep/ .el-form-item {
        margin-bottom: 0 !important;
        margin-right: 20px !important;
        position: relative;
        /deep/ .el-select__tags {
          flex-wrap: nowrap;
          overflow: hidden;
          width: 70% !important;
        }
      }
    }
    .search__form-item {
      min-width: 200px;
      margin-bottom: 10px;
    }
    .search__close-btn {
      position: absolute;
      top: 0;
      right: -20px;
      color: #000;
      cursor: pointer;
      font-size: 16px;
      &:hover {
        color: #FF431C;
      }
    }
	}
</style>
