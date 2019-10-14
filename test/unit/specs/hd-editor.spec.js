import { shallowMount } from '@vue/test-utils'
import HdEditor from 'packages/hd-editor/src/hd-editor.vue'

describe('HdEditor', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('双向绑定数据', () => {
    const value = '<p>富文本编辑器 测试文字</p>'
    wrapper = shallowMount(HdEditor)
    wrapper.vm.localValue = value
    expect(wrapper.emitted('input')[0][0]).toBe(value)
  })

  it('根据props自动设置配置参数', () => {
    const width = '500px'
    const height = '300px'
    const needImage = false
    const autoResize = false
    const maxHeight = 600
    const minHeight = 200
    const uploadFun = () => {}
    const imageList = [{ title: 'My image 1', value: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg' }]
    wrapper = shallowMount(HdEditor, {
      propsData: {
        width,
        height,
        needImage,
        autoResize,
        maxHeight,
        minHeight,
        uploadFun,
        imageList
      }
    })
    const initData = wrapper.vm.$data.editorInit
    expect(initData.plugins).toBe(
      `table ${needImage ? 'image' : ''} link placeholder lists ${autoResize ? 'autoresize' : ''}`
    )
    expect(initData.width).toBe(width)
    expect(initData.height).toBe(height)
    expect(initData.max_height).toBe(maxHeight)
    expect(initData.min_height).toBe(minHeight)
    expect(initData.image_list).toBe(imageList.length > 0 ? imageList : null)
    expect(initData.images_upload_handler).toBe(uploadFun)
  })

  it('能重置数据', () => {
    const value = '<p>富文本编辑器 测试文字</p>'
    wrapper = shallowMount(HdEditor, { propsData: { value }})
    wrapper.vm.reset()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  // TODO focus方法内调用了tinymce的get方法，但是无法stub这个tinymce，所以不知如何测试
  // it('能让富文本框获取焦点', () => {
  //   wrapper = shallowMount(HdEditor)
  //   wrapper.vm.focus()
  // })

  // TODO 也是涉及到一个tinymce的stub问题，在这个测试用tinymce的init方法似乎不会调用
  // it('在初始化后去除多余底部高度', () => {
  //   wrapper = shallowMount(HdEditor)
  // })
})
