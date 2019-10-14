import { mount, shallowMount } from '@vue/test-utils'
import HdEditorReader from 'packages/hd-editor-reader/src/hd-editor-reader.vue'

describe('HdEditorReader', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('能渲染指定内容', () => {
    const value = '<p>富文本编辑器 测试文字</p>'
    wrapper = mount(HdEditorReader, {
      propsData: {
        value
      }
    })
    const reader = wrapper.find('.reader-simple-wrapper')
    expect(reader.html()).toEqual(expect.stringContaining(value))
  })

  it('能设置是否有边框', () => {
    wrapper = shallowMount(HdEditorReader, {
      propsData: {
        border: false
      }
    })
    const readerWrapper = wrapper.find('.reader-wrapper')
    expect(readerWrapper.classes('no-border')).toBe(true)
  })
})
