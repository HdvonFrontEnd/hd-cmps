import { createLocalVue, mount, config } from '@vue/test-utils'
import HdTree from 'packages/hd-tree/src/hd-tree.vue'
config.stubs.transition = false // 同hd-tree-dropdown

import ElementUI from 'element-ui'
require('element-ui/lib/theme-chalk/index.css')

const localVue = createLocalVue()
localVue.use(ElementUI)

// 获取节点数量
const getNodeNum = (nodeList) => {
  let childNodeNum = 0
  nodeList.forEach(v => {
    if (v.children) childNodeNum += getNodeNum(v.children)
  })
  return childNodeNum + nodeList.length
}

describe('HdTree', () => {
  let wrapper
  afterEach(() => {
    wrapper.destroy()
  })

  it('根据配置渲染正确目录树', () => {
    const rootTree = {
      attrs: {
        // 默认展开所有节点
        defaultExpandAll: true,
        data: [
          {
            label: '一级 1',
            children: [
              {
                label: '二级 1-1',
                children: [
                  {
                    label: '三级 1-1-1'
                  }
                ]
              }
            ]
          },
          {
            label: '一级 2',
            children: [
              {
                label: '二级 2-1',
                children: [
                  {
                    label: '三级 2-1-1'
                  }
                ]
              },
              {
                label: '二级 2-2',
                children: [
                  {
                    label: '三级 2-2-1'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree
      }
    })
    const elTree = wrapper.findAll({ name: 'ElTree' })
    const treeNode = wrapper.findAll('.el-tree-node__content')
    expect(elTree.length).toBe(1)
    expect(treeNode.length).toBe(getNodeNum(rootTree.attrs.data))
  })

  it('支持slot', () => {
    const rootTree = {
      attrs: {
        // 默认展开所有节点
        defaultExpandAll: true,
        data: [
          {
            label: '一级 1',
            children: [
              {
                label: '二级 1-1',
                children: [
                  {
                    label: '三级 1-1-1'
                  }
                ]
              }
            ]
          },
          {
            label: '一级 2',
            children: [
              {
                label: '二级 2-1',
                children: [
                  {
                    label: '三级 2-1-1'
                  }
                ]
              },
              {
                label: '二级 2-2',
                children: [
                  {
                    label: '三级 2-2-1'
                  }
                ]
              }
            ]
          }
        ]
      }
    }
    const prependSlot = {
      template: `<span class="prepend">prepend-Slot</span>`
    }
    const appendSlot = {
      template: `<span class="append">append-Slot</span>`
    }
    wrapper = mount(HdTree, {
      localVue,
      slots: {
        prepend: prependSlot,
        append: appendSlot
      },
      propsData: {
        rootTree: rootTree
      }
    })
    const prependWrapSlot = wrapper.find('.prepend')
    const appendWrapSlot = wrapper.find('.append')
    expect(prependWrapSlot.html()).toBe(prependSlot.template)
    expect(appendWrapSlot.html()).toBe(appendSlot.template)
  })

  it('树选择框配置', () => {
    // 单选选中回调
    const selectItem = (data) => {
      console.log('selectItemData:', data)
    }
    // 检验多选
    const config = {
      type: 'checkbox',
      attrs: {
        defaultExpandAll: true,
        data: [
          {
            label: '一级 1',
            children: [
              {
                label: '二级 1-1'
              }
            ]
          }
        ]
      }
    }
    const rootTree = config
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree
      }
    })
    const checkboxNum = wrapper.findAll('.el-checkbox')
    expect(checkboxNum.length).toBe(getNodeNum(rootTree.attrs.data))
    // 检验单选
    config.type = 'radio'
    config.radio = {
      model: 'radio',
      change: selectItem
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree
      }
    })
    const radioNum = wrapper.findAll('.el-radio')
    expect(radioNum.length).toBe(getNodeNum(rootTree.attrs.data))
  })

  it('树节点的选择', () => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree
      }
    })
    const treeRef = wrapper.emitted('getTreeRef')[0][0]
    const checkboxNode = wrapper.findAll('[type = "checkbox"]')
    checkboxNode.setChecked()
    expect(JSON.stringify(treeRef.getCheckedNodes())).toBe(JSON.stringify(rootTree.attrs.data))
    expect(JSON.stringify(treeRef.getCheckedKeys())).toBe(JSON.stringify(['1001']))
  })

  it('菜单开关关闭右键点击节点', () => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree,
        show: false
      }
    })
    const node = wrapper.find({ name: 'ElTreeNode' })
    node.trigger('contextmenu')
    expect(wrapper.emitted()['node-contextmenu'] === undefined).toBe(true)
  })

  /**
   * 关于下面测试：【菜单开关开启右键点击节点】的说明
   * 此处需要等待0秒后再结束，否则组件内运行nextTick时会找不到this.$refs.contextMenu，怀疑已经被销毁。
   * 观察到几个现象，但是不清楚确切原因
   * 1. 如果不在afterEach后调用destory不会有问题
   * 2. 这个测试后面的测试中使用了异步，例如等在100ms后再done，则会有问题
   */

  it('菜单开关开启右键点击节点', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree,
        show: true
      }
    })
    const node = wrapper.find({ name: 'ElTreeNode' })
    node.trigger('contextmenu')
    const nodeData = wrapper.emitted()['node-contextmenu'][0][1]
    expect(nodeData.id).toBe(rootTree.attrs.data[0].id)
    setTimeout(() => {
      done()
    }, 0)
  })

  it('支持默认菜单插槽', () => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree,
        show: true
      }
    })
    expect(wrapper.find('.menu-wrapper').exists()).toBe(true)
  })

  it('支持添加自定义菜单插槽', () => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      }
    }
    const rightClickMenu = {
      template: `
        <div class="rightMenuSlot">rightClickMenu</div>
      `
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree: rootTree,
        show: true
      },
      slots: {
        rightClickMenu: rightClickMenu
      }
    })
    expect(wrapper.find('.rightClickMenuWrapper').exists()).toBe(false)
    expect(wrapper.find('.rightMenuSlot').exists()).toBe(true)
  })

  it('目录树节点文本过滤', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    const filter = { text: '', flag: false }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree,
        filter
      }
    })
    wrapper.setProps({ filter: { text: '广州市', flag: false }})
    setTimeout(() => {
      const nodeArr = wrapper.findAll('.is-hidden')
      expect(nodeArr.length).toBe(1)
      done()
    }, 100)
  })

  it('目录树已选中节点过滤', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    const filter = { text: '', flag: false }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree,
        filter
      }
    })
    const checkboxList = wrapper.findAll('input[type="checkbox"]')
    checkboxList.at(0).setChecked()
    setTimeout(() => {
      wrapper.setProps({ filter: { text: '', flag: true }})
      setTimeout(() => {
        const nodeArr = wrapper.findAll('.is-hidden')
        expect(nodeArr.length).toBe(1)
        done()
      }, 100)
    }, 100)
  })

  it('目录树未选中节点过滤', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    const filter = { text: '', flag: false }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree,
        filter
      }
    })
    const checkboxList = wrapper.findAll('input[type="checkbox"]')
    checkboxList.at(0).setChecked()
    setTimeout(() => {
      wrapper.setProps({ filter: { text: '', flag: true }})
      setTimeout(() => {
        const nodeArr = wrapper.findAll('.is-hidden')
        expect(nodeArr.length).toBe(1)
        done()
      }, 100)
    }, 100)
  })

  it('目录树筛选全部节点', (done) => { // 包括选中未选中
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree
      }
    })
    const checkboxList = wrapper.findAll('input[type="checkbox"]')
    checkboxList.at(0).setChecked()
    setTimeout(() => {
      wrapper.setProps({ filter: { text: '', flag: '' }})
      setTimeout(() => {
        const nodeArr = wrapper.findAll('.is-hidden')
        expect(nodeArr.length).toBe(0)
        done()
      }, 100)
    }, 100)
  })

  it('目录树无匹配节点', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    const filter = { flag: false }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree,
        filter
      }
    })
    setTimeout(() => {
      wrapper.setProps({ filter: { text: '北京', flag: false }})
      setTimeout(() => {
        const nodeArr = wrapper.findAll('.is-hidden')
        expect(nodeArr.length).toBe(2)
        expect(wrapper.findAll('.el-tree__empty-block').length).toBe(1)
        done()
      }, 100)
    }, 100)
  })

  it('目录树节点过滤', (done) => {
    const rootTree = {
      type: 'checkbox',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          },
          {
            id: '1002',
            name: '上海市',
            pid: '0',
            code: '104',
            nodeType: 'address'
          }
        ]
      }
    }
    const filter = { text: '', flag: true }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree,
        filter
      }
    })
    setTimeout(() => {
      wrapper.setProps({ filter: { text: '', flag: false }})
      setTimeout(() => {
        const nodeArr = wrapper.findAll('.is-hidden')
        expect(nodeArr.length).toBe(0)
        done()
      }, 100)
    }, 100)
  })

  it('选中单选框', (done) => {
    const rootTree = {
      type: 'radio',
      attrs: {
        data: [
          {
            id: '1001',
            name: '广州市',
            pid: '0',
            code: '101'
          }
        ]
      },
      radio: {
        model: 'radio',
        type: 'multiple'
      }
    }
    wrapper = mount(HdTree, {
      localVue,
      propsData: {
        rootTree
      }
    })
    wrapper.find('input[type="radio"]').setChecked()
    setTimeout(() => {
      expect(wrapper.emitted()['selected-item'][0][0].id).toBe(rootTree.attrs.data[0].id)
      done()
    }, 100)
  })
})
