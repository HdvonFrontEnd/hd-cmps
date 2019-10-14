import { createLocalVue, mount } from '@vue/test-utils'
import HdTreeDropdown from 'packages/hd-tree-dropdown/src/hd-tree-dropdown.vue'

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)

const treeAttrs = {
  type: 'checkbox',
  tagConfig: {
    data: [
      { isBuilder: true, tagName: '建设单位' }
    ]
  },
  treeData: [
    {
      'id': '1001',
      'name': '广州市',
      'parentId': '0',
      'status': null,
      'nodeType': 'address',
      'sort': 1
    },
    {
      'id': '1002',
      'name': '上海市',
      'parentId': '0',
      'status': null,
      'nodeType': 'address',
      'sort': 1
    },
    {
      'id': '1003',
      'name': '北京市',
      'parentId': '0',
      'status': null,
      'nodeType': 'address',
      'sort': 1
    }
  ]
}

const HdTreeDropdownTest = {
  components: { HdTreeDropdown },
  template: `
    <div style="width: 50px;">
      <hd-tree-dropdown
        v-model="treeVal"
        :treeAttrs="treeAttrs"
      ></hd-tree-dropdown>
    </div>
  `,
  data() {
    return {
      treeVal: []
    }
  },
  props: ['treeAttrs']
}

describe('HdTreeDropdown', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('根据配置生成下拉树', (done) => {
    wrapper = mount(HdTreeDropdownTest, {
      localVue,
      propsData: {
        treeAttrs
      },
      stubs: {
        transition: false // 解决transition导致的TypeError: Cannot read property '$el' of undefined， https://github.com/vuejs/vue-test-utils/issues/958
      }
    })
    setTimeout(() => {
      const treeDropdown = wrapper.find({ name: 'HdTreeDropdown' })
      const nodeList = treeDropdown.findAll('.el-tree-node')
      expect(nodeList.length).toBe(treeAttrs.treeData.length)
      done()
    }, 100)
  })

  it('关闭tag标签', (done) => {
    wrapper = mount(HdTreeDropdownTest, {
      localVue,
      propsData: {
        treeAttrs
      },
      stubs: {
        transition: false
      }
    })
    const indexArr = [0, 1]
    const treeDropdown = wrapper.find({ name: 'HdTreeDropdown' })
    const checkboxList = treeDropdown.findAll('input[type="checkbox"]')
    // 选中节点
    indexArr.forEach(v => checkboxList.at(v).setChecked())
    setTimeout(() => {
      const closeTag = treeDropdown.find('.el-tag__close')
      closeTag.trigger('click')
      const emittedItem = treeDropdown.emitted().selected[1][0]
      expect(emittedItem[0]).toBe(treeAttrs.treeData[1].id)
      // 如果不等一段时间再done的话，后续会报TypeError: Cannot read property '$el' of undefined"， 即this.$refs.select变undefined
      // TODO 有待找出真正原因
      // 与点击了closeTag有关
      setTimeout(() => {
        done()
      }, 200)
    }, 200)
  })

  it('清空已选择节点', (done) => {
    wrapper = mount(HdTreeDropdownTest, {
      localVue,
      propsData: {
        treeAttrs
      },
      stubs: {
        transition: false
      }
    })
    const treeDropdown = wrapper.find({ name: 'HdTreeDropdown' })
    const indexArr = [0, 1]
    const checkboxList = treeDropdown.findAll('input[type="checkbox"]')
    // 选中节点
    indexArr.forEach(v => checkboxList.at(v).setChecked())
    setTimeout(() => {
      treeDropdown.vm.onClear()
      const emitArr = treeDropdown.emitted().selected[1]
      emitArr.forEach(v => {
        expect(v.length).toBe(0)
      })
      done()
    }, 200)
  })

  it('下拉树禁用', () => {
    wrapper = mount(HdTreeDropdown, {
      localVue,
      propsData: {
        treeAttrs,
        disabled: true
      },
      stubs: {
        transition: false
      }
    })
    wrapper.vm.onRemoveTag()
    wrapper.vm.onClear()
    const emitted = wrapper.emitted()
    expect(Object.keys(emitted)).toHaveLength(0)
  })

  it('多选下拉树节点选择', (done) => {
    wrapper = mount(HdTreeDropdownTest, {
      localVue,
      propsData: {
        treeAttrs
      },
      stubs: {
        transition: false
      }
    })
    const treeDropdown = wrapper.find({ name: 'HdTreeDropdown' })
    const indexArr = [0, 1]
    const checkboxList = treeDropdown.findAll('input[type="checkbox"]')
    // 选中节点
    indexArr.forEach(v => checkboxList.at(v).setChecked())
    setTimeout(() => {
      const emittedIdList = treeDropdown.emitted().selected[0][0]
      const emittedObjList = treeDropdown.emitted().selected[0][1]
      indexArr.forEach(v => {
        expect(emittedIdList[v]).toBe(treeAttrs.treeData[v].id)
        expect(emittedObjList[v].name).toBe(treeAttrs.treeData[v].name)
      })
      done()
    }, 200)
  })

  it('单选下拉树节点选择', (done) => {
    treeAttrs.type = 'radio'
    wrapper = mount(HdTreeDropdownTest, {
      localVue,
      propsData: {
        treeAttrs
      },
      stubs: {
        transition: false
      }
    })
    const treeDropdown = wrapper.find({ name: 'HdTreeDropdown' })
    const radioList = treeDropdown.findAll('input[type="radio"]')
    radioList.at(0).setChecked()
    setTimeout(() => {
      const emittedList = treeDropdown.emitted().selected[0]
      expect(emittedList[0]).toBe(treeAttrs.treeData[0].id)
      expect(emittedList[1].name).toBe(treeAttrs.treeData[0].name)
      // 清空选择
      const closeTag = treeDropdown.find('.el-tag__close')
      closeTag.trigger('click')
      treeDropdown.vm.onClear()
      setTimeout(() => {
        done()
      }, 200) // 如果不等一段时间再done的话，后续会报TypeError: Cannot read property '$el' of undefined"
    }, 200)
  })
})
