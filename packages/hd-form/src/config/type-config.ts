/**
 * 定义每一个类型对应的组件，以及默认配置
 * 简单的组件可以直接使用element的，例如el-input
 * 但是对于复杂的需要组合的组件，则需要使用自定义组件，例如select需要组合el-select和el-option
 */
import { DefaultFormConfigItem } from 'types/hd-form-types'
interface ConfigSet {
  [type: string]: DefaultFormConfigItem;
}
const defaultConfigSet: ConfigSet = {
  // 输入框
  'text': {
    component: 'el-input',
    props: {
      placeholder: '请输入',
      clearable: true
    }
  },
  // 选择器
  'select': {
    component: 'base-select',
    props: {
      placeholder: '请选择',
      clearable: true
    }
  },
  // 单选组
  'radio-group': {
    component: 'base-radio-group',
    props: {
      placeholder: '请选择'
    }
  },
  // 多选组
  'checkbox-group': {
    component: 'base-checkbox-group',
    props: {
      placeholder: '请选择'
    }
  },
  // 计数器
  'number': {
    component: 'el-input-number',
    props: {
      placeholder: '请输入'
    }
  },
  // 开关
  'switch': {
    component: 'el-switch',
    props: {
      placeholder: '请选择'
    }
  },
  // 滑块
  'slider': {
    component: 'el-slider',
    props: {
      placeholder: '请选择'
    }
  },
  // 时间选择器
  'time-picker': {
    component: 'el-time-picker',
    props: {
      placeholder: '请选择',
      'range-separator': '至',
      'start-placeholder': '开始时间',
      'end-placeholder': '结束时间',
      'value-format': 'HH:mm:ss',
      clearable: true
    }
  },
  // 日期选择器
  'date-picker': {
    component: 'el-date-picker',
    props: {
      placeholder: '请选择',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      'value-format': 'yyyy-MM-dd HH:mm:ss',
      clearable: true
    }
  },
  // 评分
  'rate': {
    component: 'el-rate',
    props: {
      placeholder: '请选择'
    }
  },
  // 上传按钮
  'upload': {
    component: 'base-upload',
    props: {
      placeholder: '请上传'
    }
  },
  // 插槽
  'slot': {
    component: 'slot',
    props: {
      placeholder: '请填入'
    }
  },
  'title': {
    component: 'base-title',
    props: {}
  }

  /**
   * 有些组件不常用，或者不适合做在自定义表单上，因此先不实现。
   * 待补充组件：
   * Cascader 级联选择器
   * ColorPicker 颜色选择器
   * Transfer 穿梭框
   */

}

export default defaultConfigSet
