<template>
  <!--正常表头(不需要处理)-->
  <el-table-column
    v-if='isCommonTableColumn(column)'
    :key='index'
    v-bind='Object.assign({}, defaultAttrs, column.attrs)'
    :class-name="lastColumnClassName">
    <template slot="header" slot-scope="scope">
      <span>{{scope.column.label}}</span>
      <slot name="header" v-bind="scope"></slot>
    </template>
    <!-- 多级表头处理 -->
    <template v-if="column.children">
      <hd-column v-for="(child, cIndex) in column.children" :key="`${index}-${cIndex}`" :column="child" :index='cIndex'>
        <template :slot="child.slot" slot-scope="scope">
          <slot :name="child.slot" v-bind="{row: scope.row, column: scope.column, $index: scope.$index }"></slot>
        </template>
      </hd-column>
    </template>
  </el-table-column>
  <!-- 其他表头 -->
  <special-column
    v-else
    :column="column"
    :key="index"
    :index="index"
    @handler-event="handlerEvent"
    :defaultAttrs="column.operations ? Object.assign({}, defaultAttrs, noTooltip) : defaultAttrs"
    :columnClass="lastColumnClassName">
    <template slot="header" slot-scope="scope">
      <span>{{scope.column.label}}</span>
      <slot name="header" v-bind="scope"></slot>
    </template>
    <template :slot="column.slot" slot-scope="scope">
      <slot :name="column.slot" v-bind="{row: scope.row, column: scope.column, $index: scope.$index }"></slot>
    </template>
  </special-column>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
// TODO 编辑器会报eslint错误
import { Column } from '../models/index' //eslint-disable-line
import SpecialColumn from './SpecialColumn.vue'

@Component({
  name: 'HdColumn',
  components: {
    SpecialColumn
  }
})
export default class HdColumn extends Vue {
  // 最后一列
  @Prop(String) lastColumn!: string
  // 动态列配置
  @Prop() dynamicProp!: Column
  // 列的属性配置
  @Prop({ type: Object, default: () => ({}) }) column!: Column
  // 列的key TODO 这个没什么用
  @Prop(Number) index!: number
  // 列的默认属性
  @Prop({ type: Object, default: () => ({ 'show-overflow-tooltip': true }) }) defaultAttrs!: object

  // 对于按钮类型，默认没有tooltip
  noTooltip = { 'show-overflow-tooltip': false }
  // 特殊类型Column
  specialColumnList = [
    'operations', // 需要显示操作列表
    'slot',
    'filter' // 预处理字段
  ]

  // 最后一列的样式类名
  get lastColumnClassName() {
    return this.lastColumn === this.column.attrs.prop && this.dynamicProp && this.dynamicProp.show
      ? `last-column last-column-${this.dynamicProp.align}`
      : ''
  }

  @Emit() // 向上传递事件
  handlerEvent(handleParam) {
    return handleParam
  }

  // 是否是一个常规的table-column(有以下标签就不是常规table-column)
  isCommonTableColumn(column) {
    // return !this.specialColumnList.some(option => {
    //   if (column[option]) {
    //     return true
    //   } else if (column.attrs && column.attrs[option]) {
    //     return true
    //   } else {
    //     return false
    //   }
    // })
    return !this.specialColumnList.some(option => !!column[option] || (column.attrs && column.attrs[option]))
  }
}
</script>

