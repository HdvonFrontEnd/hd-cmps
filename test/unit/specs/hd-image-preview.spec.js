import { mount } from '@vue/test-utils'
import HdImagePreview from 'packages/hd-image-preview/src/hd-image-preview.vue'

const imageList = [
  {
    msrc: 'cat1/msrc',
    src: 'cat1',
    title: '猫咪1'
  },
  {
    msrc: 'cat2/msrc',
    src: 'cat2',
    w: 1920,
    h: 1080,
    title: '猫咪2'
  },
  {
    src: 'cat3',
    w: 1920,
    h: 1080,
    title: '猫咪3'
  }
]

describe('HdImagePreview', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('无数据不显示图片', () => {
    wrapper = mount(HdImagePreview)
    const imgWrapper = wrapper.find('.hd-img-thumbnail')
    expect(imgWrapper.attributes().src).toBeUndefined()
  })

  it('能正确显示图片', () => {
    wrapper = mount(HdImagePreview, {
      propsData: {
        imageIndex: 0,
        imageList
      }
    })
    const imgWrapper = wrapper.find('.hd-img-thumbnail')
    expect(imgWrapper.attributes().src).toBe(imageList[0].msrc)
  })

  it('点击图片能够放大显示图片', () => {
    wrapper = mount(HdImagePreview, {
      propsData: {
        imageIndex: 1,
        imageList
      }
    })
    const imgWrapper = wrapper.find('.hd-img-thumbnail')
    imgWrapper.trigger('click')
    const img = wrapper.find('.pswp__img')
    expect(img.attributes().src).toBe(imageList[1].msrc)
  })

  it('无缩略图会取原图', () => {
    wrapper = mount(HdImagePreview, {
      propsData: {
        imageIndex: 0,
        imageList: [{
          src: 'cat1',
          title: '猫咪1'
        }]
      }
    })
    const imgWrapper = wrapper.find('.hd-img-thumbnail')
    expect(imgWrapper.attributes().src).toBe('cat1')
  })
})
