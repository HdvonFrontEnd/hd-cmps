<template>
  <el-table-column
    v-if="column.attrs.isChecked"
    :key="index"
    v-bind="Object.assign({}, defaultAttrs, column.attrs)"
    :class-name="columnClass">
    <template slot="header" slot-scope="scope">
      <slot name="header" v-bind="scope"></slot>
    </template>
    <!-- 多级表头处理 -->
    <template v-if="column.children">
      <special-column v-for="(child, cIndex) in column.children" :key="`${index}-${cIndex}`" :column="child" />
    </template>

    <template slot-scope="scope">
      <template v-if="column.attrs && column.attrs.filter">
        <span>{{column.attrs.filter(scope.row[column.attrs.prop])}}</span>
      </template>

      <!--插槽/作用域插槽(作用域插槽外部使用slot-scope={scope}访问)-->
      <!--必须在<template slot-scope="scope">里,否则访问不到scope属性-->
      <template v-else-if="column.slot">
        <slot :name="column.slot" v-bind="{row: scope.row, column, $index: scope.$index}"></slot>
      </template>

      <!--操作按钮-->
      <div v-else-if="column.operations">
        <template v-if="column.operations.btns">
          <template v-for="(btn, bIndex) in column.operations.btns">
            <el-button
              v-if="btn.authName"
              :key="bIndex"
              v-bind="btn.attrs"
              v-auth="btn.authName"
              @click="handlerEvent(btn.event, scope.row)"
            >{{btn.text}}</el-button>
            <el-button
              v-else
              :key="bIndex"
              v-bind="btn.attrs"
              @click="handlerEvent(btn.event, scope.row)"
            >{{btn.text}}</el-button>
          </template>
        </template>
      </div>

      <div v-else>未知数据</div>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { Component, Prop, Emit, Vue } from 'vue-property-decorator'

@Component({ name: 'SpecialColumn' })
export default class SpecialColumn extends Vue {
  // 表格列属性
  @Prop(Object) column: object
  // 当前列的key值
  @Prop(Number) index: number
  // 列的样式类名
  @Prop(String) columnClass: string
  // 列的默认属性
  @Prop({ type: Object, default: () => ({}) }) defaultAttrs: object

  @Emit() // 点击操作按钮触发向上传递事件
  handlerEvent(eventType: string | number, row?: object) {
    return { eventType, row }
  }
}
</script>
