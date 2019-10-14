// TODO hd-table的测试尚未完成
import { shallowMount, createLocalVue } from '@vue/test-utils'
import HdTable from 'packages/hd-table/src/hd-table.vue'
// import HdColumn from 'packages/hd-table/src/comp/HDColumn.vue'
import { config } from '@vue/test-utils'
config.stubs.transition = false

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)

/**
 * 本组件基于el-table，el-table提供的功能不需要测试
 * 主要测试我们的拓展功能，例如：
 * 1. JSON配置渲染表格
 * 2. 动态列
 * 3. slot（结合JSON配置，与el-table的有区别）
 * 4. filter（结合JSON配置，与el-table的有区别）
 * 5. JSON配置的按钮
 */

describe('HdTable', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('根据配置文件渲染正确的表格', () => {
    // 注意，此处无法使用mount，会报错。猜测与element-ui有关
    // 因此设计子组件的测试需要单独测试
    wrapper = shallowMount(HdTable, {
      localVue,
      propsData: {
        data: [
          { name: 'hd', country: '中国', city: '广州' }
        ],
        columns: [
          { attrs: { label: '姓名', prop: 'name', align: 'center' }},
          { attrs: { label: '国籍', prop: 'country', align: 'center' }},
          { attrs: { label: '城市', prop: 'city', align: 'center' }}
        ]
      }
    })
    const elTable = wrapper.findAll({ name: 'ElTable' })
    const elTableColumn = wrapper.findAll({ name: 'HdColumn' })
    expect(elTable.length).toBe(1)
    expect(elTableColumn.length).toBe(3)
  })

  it('根据配置渲染按钮并能触发事件', () => {})

  it('能使用slot', () => {})

  it('能使用filter', () => {})

  it('支持动态列', () => {})
})
