import { shallowMount, createLocalVue } from '@vue/test-utils'
import HdForm from 'packages/hd-form/src/hd-form.vue'

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)

describe('HdForm', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('根据配置渲染结构', () => {
    const formComponentList = ['ElInput', 'BaseSelect', 'BaseRadioGroup', 'BaseCheckboxGroup', 'ElInputNumber', 'ElSwitch', 'ElSlider', 'ElTimePicker', 'ElDatePicker', 'ElRate', 'BaseUpload']
    const formConfig = [
      { label: '输入框', key: 'text-key', type: 'text' },
      { label: '选择器', key: 'select-key', type: 'select' },
      { label: '单选组', key: 'radio-key', type: 'radio-group' },
      { label: '多选组', key: 'checkbox-key', type: 'checkbox-group' },
      { label: '计数器', key: 'number-key', type: 'number' },
      { label: '开关', key: 'switch-key', type: 'switch' },
      { label: '滑块', key: 'slider-key', type: 'slider' },
      { label: '时间选择器', key: 'time-picker-key', type: 'time-picker' },
      { label: '日期选择器', key: 'date-picker-key', type: 'date-picker' },
      { label: '评分', key: 'rate-key', type: 'rate' },
      { label: '上传按钮', key: 'upload-key', type: 'upload', props: { action: 'https://jsonplaceholder.typicode.com/posts/' }}
    ]
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formConfig,
        formModel: {}
      }
    })
    const elForm = wrapper.findAll({ name: 'ElForm' })
    const elFormItem = wrapper.findAll({ name: 'ElFormItem' })
    expect(elForm.length).toBe(1)
    expect(elFormItem.length).toBe(formConfig.length)
    for (let i = 0; i < formComponentList.length; i++) {
      const component = wrapper.findAll({ name: formComponentList[i] })
      expect(component.length).toBe(1)
    }
  })

  it('支持设置props与formItemProps', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {},
        formConfig: [{
          label: '设置参数',
          key: 'act_type',
          type: 'text',
          formItemProps: { 'label-width': '120px' },
          props: { clearable: true }
        }]
      }
    })
    const elFormItem = wrapper.find({ name: 'ElFormItem' })
    const elInput = wrapper.find({ name: 'ElInput' })
    expect(elFormItem.props('labelWidth')).toBe('120px')
    expect(elInput.props('clearable')).toBe(true)
  })

  it('支持slot', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {},
        formConfig: [{ label: '插槽', key: 'slot-key', type: 'slot' }]
      },
      scopedSlots: {
        'slot-key': '<p class="slot-test">{{props.formItem.key}}</p>'
      }
    })
    const slot = wrapper.find('.slot-test')
    expect(slot.html()).toBe('<p class="slot-test">slot-key</p>')
  })

  it('支持联动', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {
          enable_input: false
        },
        formConfig: [
          {
            label: '是否开启输入框',
            key: 'enable_input',
            type: 'switch'
          },
          {
            label: '设置参数',
            key: 'act_type',
            type: 'text',
            ifRender(model) {
              return model.enable_input
            },
            getProps(model) {
              if (model.enable_input) {
                this.$set(model, 'act_type', '非初始值')
                return { disabled: true }
              } else {
                return {}
              }
            }
          }
        ]
      }
    })
    const switchBtn = wrapper.find({ name: 'ElSwitch' })
    let input = wrapper.find({ name: 'ElInput' })
    // 联动一：A 为特定值时，B 不显示
    expect(switchBtn).toBeDefined()
    expect(input.exists()).toBe(false)
    wrapper.setProps({ formModel: { enable_input: true }})
    input = wrapper.find({ name: 'ElInput' })
    expect(input.exists()).toBe(true)
    // 联动二：A 为特定值时，B 只能为特定范围内的值
    expect(input.props('disabled')).toBe(true)
    expect(wrapper.props('formModel')['act_type']).toBe('非初始值')
  })

  it('设置默认placeholder', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {},
        formConfig: [{ label: '设置参数', key: 'act_type', type: 'text' }]
      }
    })
    const input = wrapper.find({ name: 'ElInput' })
    expect(input.attributes('placeholder')).toBe('请输入设置参数')
  })

  it('自动补全require规则', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {},
        formConfig: [{ label: '设置参数', key: 'act_type', type: 'text', required: true }]
      }
    })
    const formItem = wrapper.find({ name: 'ElFormItem' })
    expect(JSON.stringify(formItem.props('rules')[0])).toBe('{"required":true,"message":"请输入设置参数","trigger":"change"}')
  })

  it('在恢复渲染后自动设置默认值', () => {
    wrapper = shallowMount(HdForm, {
      localVue,
      propsData: {
        formModel: {
          enable_input: true,
          act_type: '默认值'
        },
        formConfig: [
          {
            label: '是否开启输入框',
            key: 'enable_input',
            type: 'switch'
          },
          {
            label: '设置参数',
            key: 'act_type',
            type: 'text',
            ifRender(model) {
              return model.enable_input
            }
          }
        ]
      }
    })
    // 取消渲染后清除值
    wrapper.setProps({ formModel: { enable_input: false }})
    let input = wrapper.find({ name: 'ElInput' })
    expect(input.exists()).toBe(false)
    expect(JSON.stringify(wrapper.props('formModel'))).toBe('{"enable_input":false}')
    // 恢复渲染后自动设置默认值
    wrapper.setProps({ formModel: { enable_input: true }})
    input = wrapper.find({ name: 'ElInput' })
    expect(input.exists()).toBe(true)
    expect(JSON.stringify(wrapper.props('formModel'))).toBe('{"enable_input":true,"act_type":"默认值"}')
  })
})
