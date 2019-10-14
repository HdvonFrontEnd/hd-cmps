import { shallowMount, createLocalVue } from '@vue/test-utils'
import HdCron from 'packages/hd-cron/src/hd-cron.vue'
import CronGenFull from 'packages/hd-cron/src/cmps/cron-gen-full.vue'

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)

const cronGenFullStub = {
  render: () => {},
  methods: {
    generate() {
      return '* * * * * ? *'
    }
  }
}

describe('HdCron', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('能直接输入表达式也能通过组件生产表达式', () => {
    wrapper = shallowMount(HdCron, {
      localVue,
      stubs: {
        'CornGenFull': cronGenFullStub
      }
    })
    // 直接输入
    const input = wrapper.find({ name: 'ElInput' })
    input.vm.$emit('input', '1 * * * * ? *')
    expect(wrapper.emitted('input')[0][0]).toBe('1 * * * * ? *')
    // 通过组件生产
    const button = wrapper.find({ name: 'ElButton' })
    button.vm.$emit('click')
    const cronGenFull = wrapper.find({ ref: 'cornGenerator' })
    expect(cronGenFull.exists()).toBe(true)
    const confirmButton = wrapper.findAll({ name: 'ElButton' })
    confirmButton.at(2).vm.$emit('click')
    expect(wrapper.emitted('input')[1][0]).toBe('* * * * * ? *')
  })

  describe('CronGenFull', () => {
    let cronGenFull
    beforeEach(() => { cronGenFull = shallowMount(CronGenFull, { localVue }) })
    afterEach(() => { cronGenFull.destroy() })
    const setData = (type, cronEvery) => {
      const parmas = [
        {},
        {
          incrementStart: 6,
          incrementIncrement: 10
        },
        {
          specificSpecific: [12, 20]
        },
        {
          rangeStart: '3',
          rangeEnd: '20'
        }
      ]
      return {
        [type]: {
          cronEvery: cronEvery,
          ...parmas[cronEvery]
        }
      }
    }

    it('秒', () => {
      cronGenFull.setData({ ...setData('second', 1) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({ ...setData('second', 2) })
      expect(cronGenFull.vm.cron).toBe('6/10 * * * * ? *')
      cronGenFull.setData({ ...setData('second', 3) })
      expect(cronGenFull.vm.cron).toBe('12,20 * * * * ? *')
      cronGenFull.setData({ ...setData('second', 4) })
      expect(cronGenFull.vm.cron).toBe('3-20 * * * * ? *')
    })

    it('分', () => {
      cronGenFull.setData({ ...setData('minute', 1) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({ ...setData('minute', 2) })
      expect(cronGenFull.vm.cron).toBe('* 6/10 * * * ? *')
      cronGenFull.setData({ ...setData('minute', 3) })
      expect(cronGenFull.vm.cron).toBe('* 12,20 * * * ? *')
      cronGenFull.setData({ ...setData('minute', 4) })
      expect(cronGenFull.vm.cron).toBe('* 3-20 * * * ? *')
    })

    it('时', () => {
      cronGenFull.setData({ ...setData('hour', 1) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({ ...setData('hour', 2) })
      expect(cronGenFull.vm.cron).toBe('* * 6/10 * * ? *')
      cronGenFull.setData({ ...setData('hour', 3) })
      expect(cronGenFull.vm.cron).toBe('* * 12,20 * * ? *')
      cronGenFull.setData({ ...setData('hour', 4) })
      expect(cronGenFull.vm.cron).toBe('* * 3-20 * * ? *')
    })

    it('天', () => {
      cronGenFull.setData({
        day: {
          cronEvery: 1
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 2
        },
        week: {
          incrementStart: 2,
          incrementIncrement: 3
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * ? * 2/3 *')
      cronGenFull.setData({
        day: {
          cronEvery: 3,
          incrementStart: 2,
          incrementIncrement: 3
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * 2/3 * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 4
        },
        week: {
          specificSpecific: ['SUN', 'MON']
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * ? * SUN,MON *')
      cronGenFull.setData({
        day: {
          cronEvery: 5,
          specificSpecific: [1, 2]
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * 1,2 * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 6
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * L * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 7
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * LW * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 8,
          cronLastSpecificDomDay: 3
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * 3L * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 9,
          cronDaysBeforeEomMinus: 10
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * L-10 * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 10,
          cronDaysNearestWeekday: 3
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * 3W * ? *')
      cronGenFull.setData({
        day: {
          cronEvery: 11
        },
        week: {
          cronNthDayDay: 6,
          cronNthDayNth: 5
        }
      })
      expect(cronGenFull.vm.cron).toBe('* * * ? * 6#5 *')
    })

    it('月', () => {
      cronGenFull.setData({ ...setData('month', 1) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({ ...setData('month', 2) })
      expect(cronGenFull.vm.cron).toBe('* * * * 6/10 ? *')
      cronGenFull.setData({ ...setData('month', 3) })
      expect(cronGenFull.vm.cron).toBe('* * * * 12,20 ? *')
      cronGenFull.setData({ ...setData('month', 4) })
      expect(cronGenFull.vm.cron).toBe('* * * * 3-20 ? *')
    })

    it('年', () => {
      cronGenFull.setData({ ...setData('year', 1) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? *')
      cronGenFull.setData({ ...setData('year', 2) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? 6/10')
      cronGenFull.setData({ ...setData('year', 3) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? 12,20')
      cronGenFull.setData({ ...setData('year', 4) })
      expect(cronGenFull.vm.cron).toBe('* * * * * ? 3-20')
    })
  })
})
