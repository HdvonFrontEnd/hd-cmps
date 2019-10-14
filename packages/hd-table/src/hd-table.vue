<template>
  <div :class="{'hd-table': dynamicProps.show, 'no-wrap-header': noWrapHeader, 'hide-select-all' : !data.length}">
    <el-table
      :id="tableId"
      :empty-text='emptyText'
      v-bind='$attrs'
      v-on='$listeners'
      :ref='name'
      :data='data'
      :stripe='stripe'
    >
      <template v-for='(column, index) in columnList'>
        <hd-column
          v-if="column.attrs.isChecked"
          :column="column"
          :key="column.attrs.prop"
          :index="index"
          @handler-event="handlerEvent"
          :last-column="lastColumnProp"
          :dynamic-prop="dynamicProps"
        >
          <template slot="header" slot-scope="scope">

            <slot :name="column.headerSlot" v-if="column.headerSlot" v-bind="{row: scope.column, $index: scope.$index}"></slot>
            <!-- 动态列表按钮slot -->
            <template v-if="column.attrs.prop === lastColumnProp && dynamicProps.show">
              <div class="table-dropdown">
                <el-dropdown size="mini" v-bind="dynamicProps.dropdown" >
                  <el-button size="mini">
                    {{ dynamicProps.button.text }}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-checkbox-group class='table-cols-checkboxs' v-model="checkList" v-bind="dynamicProps.checkbox">
                      <template v-for="(col, index) in columns">
                        <el-checkbox v-if="!dynamicExcludedColumn.includes(col.attrs.type)" :key="index" :label="col.attrs.prop">{{col.attrs.label}}</el-checkbox>
                      </template>
                    </el-checkbox-group>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </template>
          </template>
          <!-- 普通slot -->
          <!--:slot="column.slot" 是给子组件用的-->
          <template :slot="column.slot" slot-scope="scope">
            <!--:name="column.slot" 是给页面组件（父组件）用的-->
            <slot :name="column.slot" v-bind="{row: scope.row, column: scope.column, $index: scope.$index}"></slot>
          </template>
          <!-- 多级表头slot -->
          <template v-for="child in column.children" :slot="child.slot" slot-scope="scope">
            <slot :name="child.slot" v-bind="{row: scope.row, column: scope.column, $index: scope.$index }"></slot>
          </template>
        </hd-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Watch } from 'vue-property-decorator'
import HdColumn from './comp/HDColumn.vue'
import { isTypeOf } from 'src/utils/utils.js'
import { Column, MyElTable } from './models/index' //eslint-disable-line

@Component({
  components: {
    HdColumn
  }
})
export default class HdTable extends HdCmpsComponent {
  // 列配置
  @Prop({ type: Array, required: true }) columns!: Array<Column>
  // 表格数据
  @Prop({ type: Array, required: true, default: [] }) data!: []
  // 表单id TODO 是否有必要？
  @Prop({ type: String, default: 'hd-table' }) tableId!: string
  // ref名称 TODO 是否有必要？
  @Prop({ type: String, default: 'hd-table' }) name!: string
  // 动态列配置
  @Prop({ type: Object, default: () => ({}) }) dynamicConf!: object
  // 是否滚动到顶部
  @Prop({ type: Boolean, default: true }) scrollTop!: boolean
  // 表头是否不换行
  @Prop({ type: Boolean, default: true }) noWrapHeader!: boolean

  // 不适用于动态列的列类型，例如selection、expand
  dynamicExcludedColumn = ['selection', 'expand']

  // 起到一个默认值的效果
  get emptyText(): string {
    return this.$attrs['empty-text'] || '没有符合条件的数据'
  }
  // 起到一个默认值的效果
  get stripe(): boolean {
    return this.$attrs.stripe !== 'false'
  }
  // 获取动态列
  get columnList(): Array<Column> {
    return this.columns.map(column => {
      const result = column // 原来此处有一个JSON.parse和JSON.stringify。由于此方法无法拷贝方法，所以去除
      if (typeof (result.attrs.isChecked) === 'undefined') {
        this.$set(result.attrs, 'isChecked', true) // 默认设置为true
      }
      // 如果列没有传prop，那么随机生成一个，避免动态列造成的table界面错误
      if (!result.attrs.prop && !this.dynamicExcludedColumn.includes(column.attrs.type) && this.dynamicProps.show) {
        this.$set(result.attrs, 'prop', this.genCode())
      }
      if (result.attrs.sortType) {
        this.$set(result.attrs, 'sortMethod', this.getSortMethod({
          type: result.attrs.sortType,
          sortProp: result.attrs.sortProp
        }))
      }
      return result
    })
  }
  // 设置动态列表默认属性
  get dynamicProps() {
    const defaultDynamicProps = {
      show: true, // 默认显示
      align: 'center',
      button: {
        text: '列',
        attrs: { size: 'mini' }
      },
      dropdown: { trigger: 'click' },
      checkbox: { min: 1 }
    }
    if (this.isMultiTable()) defaultDynamicProps.show = false // 如果是多级表头的表格，则默认不显示
    return Object.assign(defaultDynamicProps, this.dynamicConf)
  }
  // 最后一列的key名
  get lastColumnProp(): string {
    const showedColumnList = this.columnList.filter(item => item.attrs.isChecked)
    const last = showedColumnList[showedColumnList.length - 1]
    return last.attrs.prop || last.attrs.type
  }
  // 选中列
  get checkList(): Array<Column> {
    return this.columnList
      .filter(item => !this.dynamicExcludedColumn.includes(item.attrs.type) && item.attrs.isChecked)
      .map(item => item.attrs.prop || item.attrs.type)
  }
  set checkList(list) {
    this.columns.forEach(item => {
      if (!this.dynamicExcludedColumn.includes(item.attrs.type)) {
        const index = list.findIndex(col => col === item.attrs.prop || col === item.attrs.type)
        item.attrs.isChecked = index >= 0
      }
    })
  }

  // 数据发生变化，重新设置滚动条位置（如果开启了这个功能）
  @Watch('data')
  onDataChanged() {
    if (this.$refs[this.name] && this.scrollTop) {
      const hdTable = this.$refs[this.name] as MyElTable
      hdTable.bodyWrapper.scrollTop = 0
    }
  }

  // 按钮事件 TODO 有没有更好的办法？
  handlerEvent(handleParam) {
    this.$emit(handleParam.eventType, handleParam.row)
  }

  // ========== 排序相关 start ================
  getSortMethod({ type, sortProp } = { type: '', sortProp: '' }) {
    const isComparable = value => isTypeOf(value, 'string')
    const sortMethod = {
      pinyin: (a, b) => {
        return a[sortProp].localeCompare(b[sortProp], 'zh-Hans-CN', { sensitivity: 'accent' })
      }
    }
    const resultMethod = (a, b) => {
      const comparableA = isComparable(a[sortProp])
      const comparableB = isComparable(b[sortProp])
      if (comparableA && comparableB) {
        return sortMethod[type](a, b)
      } else if (comparableA && !comparableB) {
        return -1
      } else {
        return 1
      }
    }
    return sortMethod[type] ? resultMethod : undefined
  }
  // ========== 排序相关 end =================

  // ========== 工具函数 start =================
  /**
   * 是否为具有多级表头的表格
   */
  isMultiTable(): boolean {
    return this.columns.findIndex(column => column.children && column.children.length !== 0) !== -1
  }

  // 随机生产id
  genCode(): string {
    let d = new Date().getTime()
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now() // use high-precision timer if available
    }
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(8)
    })
  }
  // ========== 工具函数 end ===================
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.hd-table {
  // 加上固定高度可防止抖动，但是会产生一系列的问题
  // /deep/.el-table {
  //   .cell{ height: 34px !important; line-height: 34px; }
  // }
  .table-dropdown {
    display: flex;
    order: 99;
    min-width: 78px;
    padding-right: 0;
  }
  /deep/th.last-column {
    width: 50px;
    .cell {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
      // padding-left: 0;
      padding-right: 0;
      .el-dropdown {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  /deep/th.last-column-left {
    .cell {
      justify-content: flex-start;
    }
  }
  /deep/th.last-column-right {
    .cell {
      justify-content: space-between;
    }
  }
  /deep/th.last-column-center {
    .cell {
      justify-content: center;
    }
  }
}
.table-cols-checkboxs {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  .el-checkbox {
    margin-left: 0;
    & + .el-checkbox {
      margin-top: 12px;
    }
  }
}
.no-wrap-header {
  /deep/.el-table {
    th {
      .cell {
        white-space: nowrap;
      }
    }
  }
}
  .hide-select-all{
    /deep/ .el-checkbox{
      display: none;
    }
  }
</style>
