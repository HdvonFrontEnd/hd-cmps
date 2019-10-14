<template>
  <el-form
    class="hd-form-wrapper"
    ref="form"
    v-bind="$attrs"
    :label-width="labelWidth"
    :inline="inline"
    :model="formModel">
    <template v-for="(formItem, index) in $_formConfig">
      <div v-if="formItem.type === 'title'" class="hd-form__group-title">{{formItem.label}}</div>
      <el-form-item
        v-else
        :key="formItem.key + '_' +index"
        :label="formItem.label"
        :prop="formItem.key"
        :class="[isColumn ? 'column' : '']"
        :style="formItemStyle"
        v-bind="formItem.formItemProps || {}"
      >
        <slot v-if="formItem.component === 'slot'" :name="formItem.key" :formItem="formItem"></slot>
        <component
          v-else
          :is="formItem.component"
          v-model="formModel[formItem.key]"
          v-bind="formItem.props || {}"
          v-on="formItem.listeners || {}"
        ></component>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Model } from 'vue-property-decorator'
import { FormModelType, FormConfigItem, FormItemType, DefaultFormConfigItem } from 'types/hd-form-types' // eslint-disable-line
import { ElForm, ValidateCallback, ValidateFieldCallback } from 'element-ui/types/form' // eslint-disable-line
import typeConfig from './config/type-config'
import { isTypeOf } from '../../../src/utils/utils'

// 注册所有自定义表单组件
// const requireAll = context => context.keys().map(context)
// const component = require.context('./cmps', true, /\/index\.vue$/) // false 不遍历子目录，true遍历子目录
// const BaseFormComponentObject = {}
// requireAll(component).forEach(({ default: item }) => {
//   BaseFormComponentObject[item.name] = item // 奇怪，在这里就能读取组件的name
// })
import BaseCheckboxGroup from './cmps/base-checkbox-group/index.vue'
import BaseRadioGroup from './cmps/base-radio-group/index.vue'
import BaseSelect from './cmps/base-select/index.vue'
import BaseTitle from './cmps/base-title/index.vue'
import BaseUpload from './cmps/base-upload/index.vue'

@Component({
  components: {
    BaseCheckboxGroup,
    BaseRadioGroup,
    BaseSelect,
    BaseTitle,
    BaseUpload
    // ...BaseFormComponentObject
  }
})
export default class HdForm extends HdCmpsComponent {
  @Model('updateFormModel', { type: Object }) readonly formModel!: FormModelType

  // @Prop({ type: Object }) readonly formModel!: any
  @Prop({ type: Array }) readonly formConfig!: FormConfigItem[]
  @Prop({ default: '80px' }) readonly labelWidth!: number | string
  @Prop({}) readonly inline!: boolean
  @Prop({ type: Number, default: 2 }) readonly colNum!: number

  copyModel = Object.create(null) // 缓存传入的model，用于后续恢复

  // 是否为分列布局
  get isColumn(): boolean {
    return (typeof this.colNum !== 'undefined') && this.colNum > 1 && this.inline
  }

  // el-form-item的内联样式，用于分列布局
  get formItemStyle(): object {
    const res = Object.create(null)
    if (this.isColumn) {
      res.width = `${100 / this.colNum}%`
      res['margin-right'] = 0
    }
    return res
  }

  get $_formConfig(): FormConfigItem[] {
    return this.formConfig.map(formItem => this.$_computeFormItem(formItem, this.formModel))
      .filter(formItem => formItem.$_ifRender)
  }

  // el-form子组件
  get form(): ElForm {
    return this.$refs.form as ElForm
  }

  // 启动之后拷贝一次传入的model值，用于后续恢复
  created() {
    this.copyModel = JSON.parse(JSON.stringify(this.formModel))
  }

  /**
   * 对整个表单进行校验的方法
   */
  validate(callback?: ValidateCallback): void | Promise<boolean> {
    return callback ? this.form.validate(callback) : this.form.validate()
  }
  /**
   * 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
   */
  resetFields(): void {
    return this.form.resetFields()
  }
  /**
   * 对部分表单字段进行校验的方法
   */
  validateField(props: string | string[], callback: ValidateFieldCallback): void {
    return this.form.validateField(props, callback)
  }
  /**
   * 移除表单项的校验结果
   */
  clearValidate(props?: string | string[]): void {
    return this.form.clearValidate(props)
  }
  /**
   * 生成表单项的最终配置
   * @param formItem
   * @param model
   */
  private $_computeFormItem(formItem: FormConfigItem, model: FormModelType): FormConfigItem {
    const config: FormConfigItem = { ...formItem }
    const type: FormItemType = formItem.type || 'text'
    if (!typeConfig[type]) {
      throw new Error('该表单项类型不存在')
    }
    const defaultTypeConfig: DefaultFormConfigItem = JSON.parse(JSON.stringify(typeConfig[type]))

    // 设置默认的placeholder
    this.$_setPlaceholder(config, defaultTypeConfig)

    // 设置ref
    defaultTypeConfig.props.ref = config.key

    config.component = defaultTypeConfig.component // 设置组件
    config.props = Object.assign({}, defaultTypeConfig.props, config.props) // 设置props

    // 设置校验规则
    this.$_setRule(config)

    // 设置动态props
    this.$_setDynamicProps(config, model)

    // 设置render
    this.$_setRender(config, model)

    // formModel赋值
    this.$_setFormModel(config, model)

    return config
  }
  // 设置placeholder
  private $_setPlaceholder(config: FormConfigItem, defaultTypeConfig: DefaultFormConfigItem): void {
    // 设置默认的placeholder
    if (defaultTypeConfig.props && defaultTypeConfig.props.placeholder) {
      defaultTypeConfig.props.placeholder = defaultTypeConfig.props.placeholder + config.label
    }
  }
  // 设置动态props
  private $_setDynamicProps(config: FormConfigItem, model: FormModelType): void {
    // 如果有动态获取的props（主要用于某些与值相关的联动，例如：A 为特定值时，B 只能为特定范围内的值）
    if (config.getProps && isTypeOf(config.getProps, 'function')) {
      config.props = Object.assign({}, config.props, config.getProps.call(this, model))
    }
  }
  // 设置render
  private $_setRender(config: FormConfigItem, model: FormModelType): void {
    // 如果有条件渲染（用于类似A 为特定值时，B 不显示的联动）
    config.$_ifRender = (config.ifRender && isTypeOf(config.ifRender, 'function')) ? !!config.ifRender.call(this, model) : true
  }
  // 设置校验规则
  private $_setRule(config: FormConfigItem): void {
    if (config.required) {
      const rule = {
        required: true,
        message: config.props && config.props.placeholder ? `${config.props.placeholder}` : '请填入',
        trigger: 'change'
      }
      if (!config.formItemProps) this.$set(config, 'formItemProps', {})
      if (config.formItemProps && !config.formItemProps.rules) this.$set(config.formItemProps, 'rules', [])
      if (config.formItemProps && Array.isArray(config.formItemProps.rules)) {
        config.formItemProps.rules.push(rule)
      } else {
        throw new Error('自动设置校验规则失败')
      }
    }
  }
  // formModel赋值
  private $_setFormModel(config: FormConfigItem, model: FormModelType): void {
    if (config.$_ifRender && config.key) {
      // 如果有默认formModel值，就赋默认值
      if (!model.hasOwnProperty(config.key)) {
        const val = this.copyModel.hasOwnProperty(config.key) ? this.copyModel[config.key] : undefined
        this.$set(model, config.key, val)
      }
    } else if (config.key) {
      // 防止表单提交时存在多余 key
      // Vue 不能检测对象属性的添加或删除
      // 此操作无法更新视图: delete model[formItem.key]
      // 要使用Vue.delete强制更新
      this.$delete(model, config.key)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .hd-form-wrapper {
    .hd-form__group-title {
      width: 100%;
      padding: 5px 0;
      margin-bottom: 15px;
      font-size: 14px;
    }
    .column {
      display: inline-flex;
      align-items: center;
      /deep/ .el-form-item__content {
        flex: 1;
        margin-right: 10px;
      }
    }
    /deep/ .el-form-item__content {
      .el-select {
        display: block;
      }
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner,
      .el-date-editor--daterange.el-input,
      .el-date-editor--daterange.el-input__inner,
      .el-date-editor--timerange.el-input,
      .el-date-editor--timerange.el-input__inner,
      .el-date-editor--datetimerange.el-input,
      .el-date-editor--datetimerange.el-input__inner {
        width: 100%;
      }
    }
  }
</style>
