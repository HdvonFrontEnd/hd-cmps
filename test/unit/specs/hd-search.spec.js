import { shallowMount, createLocalVue } from '@vue/test-utils'
import HdSearch from 'packages/hd-search/src/hd-search.vue'
import HdSearchMore from 'packages/hd-search/src/cmp/hd-search-more'
import HdSearchSelect from 'packages/hd-search/src/cmp/hd-search-select'
import HdSearchSingleSelect from 'packages/hd-search/src/cmp/hd-search-single-select'

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)
describe('HdSearch', () => {
  const DEBOUNCE_TIMEOUT = 300
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('能正确渲染', () => {
    wrapper = shallowMount(HdSearch, {
      localVue,
      propsData: {
        conditionList: [
          {
            label: '类型',
            key: 'type',
            placeholder: '类型',
            stand: true,
            options: [{ label: 'Epic', key: 'epic' }]
          },
          {
            key: 'deviceType',
            label: '设备类型',
            placeholder: '设备类型',
            type: 'radio',
            stand: true,
            options: [{ key: 'ipc', label: '普通摄像机' }]
          },
          {
            key: 'deviceName',
            label: '设备名称',
            stand: true,
            placeholder: '设备名称',
            type: 'input'
          },
          { key: 'address', label: '地址', type: 'input' },
          {
            key: 'startTime',
            label: '发生开始',
            stand: true,
            type: 'dateTime'
          },
          {
            key: 'dateTimeRange',
            label: '时间范围',
            stand: true,
            type: 'dateTimeRange'
          }
        ]
      }
    })
    const select = wrapper.findAll({ name: 'hd-search-select' })
    const radio = wrapper.findAll({ name: 'hd-search-single-select' })
    const input = wrapper.findAll({ name: 'ElInput' })
    const dateTime = wrapper.findAll({ name: 'ElDatePicker' })
    const moreBtn = wrapper.find({ name: 'hd-search-more' })
    const btn = wrapper.findAll({ name: 'ElButton' })
    expect(select.length).toBe(1) // 渲染多选组件
    expect(radio.length).toBe(1) // 渲染单选组件
    expect(input.length).toBe(1) // 渲染输入框
    expect(dateTime.length).toBe(2)
    expect(dateTime.at(0).props('type')).toBe('datetime') // 渲染日期时间选择器
    expect(dateTime.at(1).props('type')).toBe('datetimerange') // 渲染范围日期时间选择器
    expect(moreBtn.isVisible()).toBe(true) // 有一个条件的stand不为true时应该出现‘更多’按钮
    expect(btn.length).toBe(2) // 应该有重置与查询按钮
  })

  it('能正确触发事件', done => {
    wrapper = shallowMount(HdSearch, {
      localVue,
      propsData: {
        conditionList: [
          {
            label: '类型',
            key: 'type',
            placeholder: '类型',
            stand: true,
            options: [{ label: 'Epic', key: 'epic' }]
          },
          {
            key: 'deviceName',
            label: '设备名称',
            placeholder: '设备名称',
            type: 'input'
          },
          { key: 'address', label: '地址', type: 'input' }
        ]
      }
    })
    const btn = wrapper.findAll({ name: 'ElButton' })
    btn.at(0).vm.$emit('click')
    btn.at(1).vm.$emit('click')
    expect(
      wrapper
        .emittedByOrder()
        .map(e => e.name)
        .join(',')
    ).toBe('search,reset') // 触发查询(search)与重置（reset）事件
    wrapper.setData({
      formTop: {
        optionList: ['address']
      }
    })
    const removeBtn = wrapper.findAll('.search__close-btn')
    expect(removeBtn.length).toBe(1)
    removeBtn.trigger('click')
    wrapper.setData({
      formBottom: {
        address: 'test'
      }
    })
    expect(wrapper.emitted().removed.length).toBe(1) // 移除查询条件时能触发removed事件
    setTimeout(() => {
      expect(wrapper.emitted().change.length).toBe(3) // 修改的时候能触发change事件，包括之前的移除、重置也会触发change时间（应用了debounce，有延迟）
      done()
    }, DEBOUNCE_TIMEOUT)
  })

  it('能正确添加删除条件', () => {
    // 添加之后应该能渲染出指定条件
    // 删除之后应该触发removed事件并且清除相关数据
    // 分两种删除：点击删除按钮，取消‘更多’里面的选择
    wrapper = shallowMount(HdSearch, {
      localVue,
      propsData: {
        conditionList: [
          { key: 'address', label: '地址', type: 'input' }
        ]
      }
    })
    // 添加条件
    let input = wrapper.findAll({ name: 'ElInput' })
    expect(input.length).toBe(0)
    wrapper.setData({ formTop: { optionList: ['address'] }})
    input = wrapper.findAll({ name: 'ElInput' })
    expect(input.length).toBe(1)
    // 点击删除按钮删除
    wrapper.setData({ formBottom: { address: 'test' }})
    const removeBtn = wrapper.find('.search__close-btn')
    removeBtn.trigger('click')
    expect(wrapper.vm.$data.formBottom.address).toBeUndefined()
    expect(wrapper.vm.$data.formTop.optionList).toEqual([])
    // 直接取消‘更多’里面的选择
    wrapper.setData({ formTop: { optionList: ['address'] }})
    wrapper.setData({ formBottom: { address: 'test' }})
    wrapper.setData({ formTop: { optionList: [] }})
    expect(wrapper.vm.$data.formBottom.address).toBeUndefined()
    input = wrapper.findAll({ name: 'ElInput' })
    expect(input.length).toBe(0)
  })

  it('能重置查询', () => {
    // 重置之后应该清除数据，但是保留已选择的“更多”条件
    wrapper = shallowMount(HdSearch, {
      localVue,
      propsData: {
        conditionList: [
          { key: 'address', label: '地址', type: 'input', stand: true },
          { key: 'deviceName', label: '设备名称', type: 'input' }
        ]
      }
    })
    wrapper.setData({
      formTop: { address: 'test', optionList: ['deviceName'] },
      formBottom: { deviceName: 'test' }
    })
    const btn = wrapper.findAll({ name: 'ElButton' })
    expect(wrapper.vm.$data.formTop.optionList.join(',')).toBe('deviceName')
    btn.at(1).vm.$emit('click') // 点击重置按钮
    expect(wrapper.vm.$data.formBottom.deviceName).toBeUndefined() // 清空数据
    expect(wrapper.vm.$data.formTop.address).toBeUndefined()
    expect(wrapper.vm.$data.formTop.optionList.join(',')).toBe('deviceName') // 保留已选择的“更多”条件
  })

  it('能双向绑定', (done) => {
    // 通过检查searchData与updateSearchData来检查v-model
    // 传入的v-model可以正确初始化，包括自动将某个更多条件选中
    // 内部数据变化能正确触发updateSearchData事件更新v-model
    wrapper = shallowMount(HdSearch, {
      localVue,
      propsData: {
        conditionList: [
          { key: 'address', label: '地址', type: 'input', stand: true },
          { key: 'deviceName', label: '设备名称', type: 'input' }
        ]
      }
    })
    wrapper.setProps({
      searchData: { address: 'testAddress', deviceName: 'testDeviceName' }
    })
    expect(wrapper.vm.$data.formTop.optionList.join(',')).toBe('deviceName')
    expect(wrapper.vm.$data.formTop.address).toBe('testAddress')
    expect(wrapper.vm.$data.formBottom.deviceName).toBe('testDeviceName') // 能根据searchData初始化
    wrapper.setData({
      formTop: { address: 'testAddress2' }
    })
    setTimeout(() => {
      expect(wrapper.emitted().updateSearchData.length).toBe(2) // 修改数据后能正确触发updateSearchData事件，包括之前设置searchData也会触发
      done()
    }, DEBOUNCE_TIMEOUT) // 因为事件做了debounce，所以要用setTimeout
  })

  // 接下来测试各个子组件

  // HdSearchMore组件
  describe('HdSearchMore', () => {
    let hdSearchMore
    afterEach(() => {
      hdSearchMore.destroy()
    })
    it('能正确渲染结构', () => {
      hdSearchMore = shallowMount(HdSearchMore, {
        localVue,
        propsData: {
          popWidth: 300, // 指定宽度
          searchOptionList: [
            { key: 'deviceName', label: '设备名称', type: 'input' }
          ]
        }
      })
      const btn = hdSearchMore.findAll({ name: 'ElButton' })
      const item = hdSearchMore.findAll('.select-panel-item')
      const popover = hdSearchMore.findAll({ name: 'ElPopover' })
      hdSearchMore.setData({
        selectPanelVisible: true
      })
      expect(btn.length).toBe(1) // 渲染按钮
      expect(item.length).toBe(1) // 渲染列表
      expect(popover.at(0).attributes('width')).toBe('300') // 渲染指定宽度
    })
    it('能双向绑定', () => {
      hdSearchMore = shallowMount(HdSearchMore, {
        localVue,
        propsData: {
          searchOptionList: [
            { key: 'deviceName', label: '设备名称', type: 'input' }
          ],
          selectedOption: ['deviceName']
        }
      })
      const item = hdSearchMore.findAll('.selected')
      expect(item.length).toBe(1) // 根据传入值初始化
      item.at(0).trigger('click')
      expect(hdSearchMore.vm.localSelectedOption.length).toBe(0)
      expect(hdSearchMore.emitted().updateSelected.length).toBe(1) // 正确触发事件，更新值
    })
  })

  // HdSearchSelect组件
  describe('HdSearchSelect', () => {
    let hdSearchSelect
    beforeEach(() => {
      hdSearchSelect = shallowMount(HdSearchSelect, {
        localVue,
        propsData: {
          optionList: [
            {
              key: 'user1',
              label: '用户1'
            },
            {
              key: 'user2',
              label: '用户2'
            }
          ],
          value: ['user1']
        }
      })
    })
    afterEach(() => {
      hdSearchSelect.destroy()
    })
    it('能双向绑定', () => {
      expect(hdSearchSelect.vm.$data.checkedListModel.join(',')).toBe('user1')
      hdSearchSelect.setData({ checkedListModel: [] })
      expect(hdSearchSelect.emitted().input.length).toBe(2) // 一次是checkbox触发，一次是自己触发
    })
    it('能区分已选与未选', () => {
      expect(JSON.stringify(hdSearchSelect.vm.$data.checkedList)).toBe('[{"key":"user1","label":"用户1"}]')
      expect(JSON.stringify(hdSearchSelect.vm.$data.uncheckedList)).toBe('[{"key":"user2","label":"用户2"}]')
    })
    it('能搜索', () => {
      hdSearchSelect.setData({ searchKeyWord: '用户1' })
      expect(JSON.stringify(hdSearchSelect.vm.$data.searchList)).toBe('[{"key":"user1","label":"用户1"}]')
    })
  })

  // HdSearchSingleSelect组件
  describe('HdSearchSingleSelect', () => {
    let hdSearchSingleSelect
    beforeEach(() => {
      hdSearchSingleSelect = shallowMount(HdSearchSingleSelect, {
        localVue,
        propsData: {
          optionList: [
            {
              key: 'user1',
              label: '用户1'
            },
            {
              key: 'user2',
              label: '用户2'
            }
          ],
          value: 'user1'
        }
      })
    })
    afterEach(() => {
      hdSearchSingleSelect.destroy()
    })

    it('能双向绑定', () => {
      expect(hdSearchSingleSelect.vm.$data.selectedItem).toBe('user1')
      hdSearchSingleSelect.setData({ selectedItem: 'user2' })
      expect(hdSearchSingleSelect.emitted().input.length).toBe(2) // 一次是el-radio，一次是组件自己
    })
    it('能搜索', () => {
      hdSearchSingleSelect.setData({ searchKeyWord: '用户1' })
      expect(JSON.stringify(hdSearchSingleSelect.vm.searchResultOptionList)).toBe('[{"key":"user1","label":"用户1"}]')
    })
  })
})
