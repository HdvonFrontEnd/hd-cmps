import { shallowMount } from '@vue/test-utils'
import HdChart from 'packages/hd-chart/src/hd-chart.vue'
import deepmerge from 'deepmerge'

const componentDefaultOption = {
  tooltip: {
    trigger: 'item',
    confine: true
  },
  legend: {
    show: true
  },
  xAxis: {
    type: 'category'
  },
  yAxis: {
    type: 'value'
  },
  grid: {
    containLabel: true
  },
  toolbox: {
    show: true,
    feature: {
      magicType: { type: ['line', 'bar'] },
      restore: {}
    }
  }
}

describe('HdChart', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('能根据图表类型设置默认配置', () => {
    wrapper = shallowMount(HdChart)
    // bar 类型
    wrapper.setProps({ chartType: 'bar' })
    expect(JSON.stringify(wrapper.vm.finalOption)).toBe(JSON.stringify(componentDefaultOption))
    // line 类型
    wrapper.setProps({ chartType: 'line' })
    expect(JSON.stringify(wrapper.vm.finalOption)).toBe(JSON.stringify(deepmerge(componentDefaultOption, {
      tooltip: {
        trigger: 'axis'
      },
      yAxis: { type: 'value' }
    })))
    // pie 类型
    wrapper.setProps({ chartType: 'pie' })
    expect(JSON.stringify(wrapper.vm.finalOption)).toBe(JSON.stringify(deepmerge(componentDefaultOption, {
      xAxis: { show: false },
      yAxis: { show: false }
    })))
    // ring 类型
    wrapper.setProps({ chartType: 'ring' })
    expect(JSON.stringify(wrapper.vm.finalOption)).toBe(JSON.stringify(deepmerge(componentDefaultOption, {
      xAxis: { show: false },
      yAxis: { show: false },
      legend: {},
      title: {
        x: 'center',
        y: '43%',
        textStyle: {
          fontSize: 16
        },
        subtextStyle: {
          fontSize: 24
        }
      }
    })))
  })

  it('用自定义配置覆盖', () => {
    wrapper = shallowMount(HdChart)
    const customOptions = {
      grid: {
        containLabel: false
      },
      toolbox: {
        feature: {
          magicType: {}
        }
      }
    }
    wrapper.setProps({ chartType: 'bar', customOptions: customOptions })
    expect(JSON.stringify(wrapper.vm.finalOption)).toBe(JSON.stringify(componentDefaultOption, customOptions))
  })

  it('点击能触发事件', () => {
    wrapper = shallowMount(HdChart, {
      propsData: { chartType: 'bar' }
    })
    const chart = wrapper.find({ ref: 'chart' })
    chart.vm.$emit('click')
    expect(wrapper.emitted().chartClick.length).toBe(1)
  })

  it('默认开启autoResize', () => {
    wrapper = shallowMount(HdChart, {
      propsData: { chartType: 'bar', autoResize: true }
    })
    const chart = wrapper.find({ ref: 'chart' })
    expect(chart.props('autoresize')).toBe(true)
  })

  it('能适配原有配置', () => {
    wrapper = shallowMount(HdChart, {
      propsData: { chartType: 'bar', theme: 'dark' }
    })
    const chart = wrapper.find({ ref: 'chart' })
    expect(chart.props('theme')).toBe('dark')
  })
})
