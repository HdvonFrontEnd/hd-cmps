import { mount } from '@vue/test-utils'
// 对于ts组件，需要直接引入vue文件，如果同index.ts引入，会报找不到xxx.vue（因为此时vue已经变成vue.ts）
import HdCloudCtrl from 'packages/hd-cloud-ctrl/src/hd-cloud-ctrl.vue'

describe('HdCloudCtrl', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('能配置箭头个数', () => {
    wrapper = mount(HdCloudCtrl, {
      propsData: {
        arrowNum: 4
      }
    })
    const arrowArr = wrapper.findAll('.button i')
    expect(arrowArr.length).toBe(4)
  })

  it('能配置箭头图标与复位图标', () => {
    wrapper = mount(HdCloudCtrl, {
      propsData: {
        arrowNum: 8,
        arrowIcon: 'fake-arrow-icon',
        homeIcon: 'fake-home-icon'
      }
    })
    const arrowArr = wrapper.findAll('.fake-arrow-icon')
    const homeArr = wrapper.findAll('.fake-home-icon')
    expect(arrowArr.length).toBe(8)
    expect(homeArr.length).toBe(1)
  })

  it('能正确触发事件', () => {
    wrapper = mount(HdCloudCtrl, {
      propsData: {
        arrowNum: 8,
        arrowIcon: 'fake-arrow-icon',
        homeIcon: 'fake-home-icon'
      }
    })
    const arrowBtnArr = wrapper.findAll('.fake-arrow-icon')
    const homeArr = wrapper.findAll('.fake-home-icon')
    arrowBtnArr.trigger('mousedown')
    arrowBtnArr.trigger('mouseup')
    homeArr.trigger('click')
    expect(wrapper.emitted().arrowMouseDown.length).toBe(8)
    expect(wrapper.emitted().arrowMouseUp.length).toBe(8)
    expect(wrapper.emitted().homeClick.length).toBe(1)
  })
})
