## Tree
二级封装el-tree组件

#### 功能实现
- 在el-tree组件基础上做二次封装
- 支持自定义tree
- 支持右击菜单显示slot块
- 支持但选项操作
- 支持菜单右侧追加tag标签

### 基本用法
基础的Tree树形的用法。

:::demo root-tree 顶层Tree配置, attrs 使用同el-tree传参方式即可。 具体可参考[element-ui 官网](https://element.eleme.cn/#/zh-CN/component/tree) 
```html
<template>
  <hd-tree :root-tree="rootTree"></hd-tree>
</template>

<script>
export default {
  data () {
    return {
      // Tree配置
      rootTree: {
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [{
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
          }]
        },
        // 事件，使用同el-tree传参即可
        listeners: {
          'node-click': this.handleNodeClick
        },
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  methods: {
    // 点击节点事件
    handleNodeClick (data) {
      // ...
    }
  }
}
</script>
```
:::


### slot用法
slot-scope返回参数有data

:::demo
```html
<template>
  <hd-tree :root-tree="rootTree">
    <span slot="prepend" >prepend-Slot</span>
    <span slot="append" >append-Slot</span>
  </hd-tree>
</template>

<script>
export default {
  data () {
    return {
      // Tree配置
      rootTree: {
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [{
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
          }]
        },
        // 事件，使用同el-tree传参即可
        listeners: {
          'node-click': this.handleNodeClick
        },
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  methods: {
    // 点击节点事件
    handleNodeClick (data) {
      // ...
    }
  }
}
</script>
```
:::

### 可选择Tree树形
适用于需要选择层级时使用。

:::demo type 为 'checkbox'， show-checkbox 设置可选择
```html
<template>
  <hd-tree :root-tree="rootTree"></hd-tree>
</template>

<script>
export default {
  data () {
    return {
      // Tree配置
      rootTree: {
        type: 'checkbox',
        // 属性，使用同el-tree传参方式即可
        attrs: {
          'show-checkbox': true, // 设置可选择
          data: [{
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
          }]
        },
        // 事件，使用同el-tree传参即可
        listeners: {
          'check-change': this.handleCheckChange,
          'node-click': this.handleNodeClick
        },
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    }
  },
  methods: {
    // 多选回调
    handleCheckChange(data, checked, indeterminate) {
      // ...
    },
    // 点击节点事件
    handleNodeClick (data) {
      // ...
    }
  }
}
</script>
```
:::

### 自定义节点内同Tree树形（一）
节点的内容支持自定义，可以在节点区添加按钮或图标等内容。

:::demo 除了配置root-tree对象相关属性之外，还需配置custom-tree相关属性；可参考以下代码。
```html
<template>
  <hd-tree :root-tree="rootTree" :custom-tree="customTree"></hd-tree>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: '1',
          name: '广州市',
          pid: '0',
          code: '101',
          nodeType: 'address'
        },
        {
          id: '2',
          name: '北京市',
          pid: '0',
          code: '104',
          nodeType: 'address'
        },
        {
          id: '3',
          name: '上海市',
          pid: '0',
          code: '103',
          nodeType: 'address'
        }
      ],
      // 顶层Tree配置
      rootTree: {
        type: 'radio', // 单选
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [],
          lazy: true, // 启用懒加载
          load: this.loadNodes // 绑定懒加载数据回调
        },
        // 事件，使用同el-tree传参即可
        listeners: {},
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf' // 自定义，对应数据的字段，需返回boolean
        },
        // 如果是单选项可加该配置
        radio: {
          model: 'radio', // radio绑定数据，必传
          label: 'name', // 单选名, 可不传， 默认为name
          value: 'id', // 单选值，可不传，默认为id
          change: this.selectItem // 选中回调, 当传了type: multiple 值后，这个项将不启用,change值获取方法通过 @selected-item
          // type: 'multiple' // 返回信息类型，返回节点的所有信息
        }
      },
      // 自定义Tree配置
      customTree: {
        attrs: {
          draggable: false // 是否可拖拽
        },
        listeners: {
          dragstart: this.dragStartHandler // 拖拽回调
        }
      }
    }
  },
  methods: {
    // 拖拽回调
    dragStartHandler(event, data) {
      // console.log('dragStartEvent', event)
      console.log('dragStartData', data)
    },
    // 单选选中回调
    selectItem(data) {
      console.log('selectItemData:', data)
    },
    // 懒加载数据
    loadNodes(node, resolve) {
      if (node.level === 0) {
        return resolve(this.list)
      }
      if (node.level > 1) {
        return resolve([])
      }
      const list = [1, 2, 3, 4, 5].map((_, index) => {
        return {
          id: '1' + index,
          name: '测试' + index,
          code: '101' + index,
          leaf: true
        }
      })
      resolve(list)
    },
    onClick(data) {
      console.log(data)
    }
  }
}
</script>
```
:::

### 自定义节点内同Tree树形（二）
节点的内容支持自定义，可以在节点区添加按钮或图标等内容。

:::demo 除了配置root-tree对象相关属性之外，还需配置node-style-conf，以及menu-conf或tag-config相关属性；可参考以下代码。
```html
<template>
  <hd-tree
    :root-tree="rootTree"
    :node-style-conf="nodeStyleConf"
    :menu-conf="menuConf"
    :tag-config="tagConfig"
  ></hd-tree>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          id: '1',
          name: '广州市',
          pid: '0',
          code: '101',
          nodeType: 'address'
        },
        {
          id: '2',
          name: '北京市',
          pid: '0',
          code: '104',
          nodeType: 'address'
        },
        {
          id: '3',
          name: '上海市',
          pid: '0',
          code: '103',
          nodeType: 'address'
        }
      ],
      // 顶层Tree配置
      rootTree: {
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [],
          lazy: true, // 启用懒加载
          load: this.loadNodes // 绑定懒加载数据回调
        },
        // 事件，使用同el-tree传参即可
        listeners: {},
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf' // 自定义，对应数据的字段，需返回boolean
        }
      },
      // 父节点配置
      nodeStyleConf: {
        root: {
          nodeColor: '#f0a335', // 父节点颜色(不配置默认#000)
          nodeIcon: 'icon-wenjianjia1' // 父节点icon(不配置默认无)
        },
        children: {
          nodeColor: '#000',
          nodeIcons: [
            { nodeType: 'user', icon: 'icon-yonghu2' },
            { nodeType: 'encoder', icon: 'icon-bianmaqi' },
            { deviceType: '1', icon: 'icon-shebeileiqiuji', color: '#ff0000' },
            { deviceType: '2', icon: 'icon-shebeileiqiuji' },
            { deviceType: '3', icon: 'icon-jiankongqiangji' },
            { deviceType: '4', icon: 'icon-jiankongqiangji' }
          ]
        }
      },
      // Tree Menu配置
      menuConf: {
        headIcon: 'icon-zuzhijigou',
        menuItems: [
          {
            class: 'icon-zuzhijigou',
            text: '测试'
          }
        ],
        listeners: {
          click: this.menuClick
        }
      },
      // Tree Tag配置
      // 如数据isBuilder为1，设置对应的标签名称以及颜色(颜色必须根据element-ui里面tag组件的type对应，默认为primary)
      // 若不配置相应的tag则不会出现tag
      tagConfig: {
        data: [
          { isConstructor: 1, tagName: '建设' },
          { isBuilder: 1, tagName: '承建', tagColor: 'danger' },
          { nodeType: 'project', tagName: '项目', tagColor: 'warning' },
          { nodeType: 'organization', tagName: '组织', tagColor: 'warning' }
        ]
      }
    }
  },
  methods: {
    menuClick(item) {
      console.log('menuClick:', item)
    },
    // 懒加载数据
    loadNodes(node, resolve) {
      if (node.level === 0) {
        return resolve(this.list)
      }
      if (node.level > 1) {
        return resolve([])
      }
      const list = [1, 2, 3, 4, 5].map((_, index) => {
        return {
          id: '405449368320409' + index,
          name: '测试' + index,
          code: '101' + index,
          nodeType: 'project',
          leaf: true
        }
      })
      resolve(list)
    }
  }
}
</script>
```
::::::

### 树节点的选择

:::demo 本例展示如何获取和设置选中节点。首先必须定义treeId，区分页面有多个tree；使用getTreeRef事件接受返回的tree对象，获取和设置各有两种方式：通过 node 或通过 key。如果需要通过 key 来获取或设置，则必须设置node-key；可参考以下代码。
```html
<template>
  <div>
    <el-button type="primary" size="mini" @click="getCheckedNodes">通过 node 获取</el-button>
    <el-button type="primary" size="mini" @click="getCheckedKeys">通过 key 获取</el-button>
    <el-button type="primary" size="mini" @click="setCheckedNodes">通过 node 设置</el-button>
    <el-button type="primary" size="mini" @click="setCheckedKeys">通过 key 设置</el-button>
    <el-button type="primary" size="mini" @click="resetChecked">清 空</el-button>

    <hd-tree
      :root-tree="rootTree"
      treeId="tree1"
      @getTreeRef="getTreeRef"
      :filter="filter">    
    </hd-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          id: '1',
          name: '广州市',
          pid: '0',
          code: '101',
          nodeType: 'address'
        },
        {
          id: '2',
          name: '北京市',
          pid: '0',
          code: '104',
          nodeType: 'address'
        },
        {
          id: '3',
          name: '上海市',
          pid: '0',
          code: '103',
          nodeType: 'address'
        }
      ],
      tree: null, // 用于接收返回的树对象
      // 顶层Tree配置
      rootTree: {
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [],
          lazy: true, // 启用懒加载
          load: this.loadNodes, // 绑定懒加载数据回调
          'show-checkbox': true // 设置可选择
        },
        // 事件，使用同el-tree传参即可
        listeners: {},
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf' // 自定义，对应数据的字段，需返回boolean
        }
      },
      filter: {
        text: '',
        flag: false
      }
    }
  },
  methods: {
    getTreeRef(tree, treeId) {
      this.tree = tree
    },
    // 通过nodes获取
    getCheckedNodes() {
      if (!this.tree) return
      console.log(this.tree.getCheckedNodes())
    },
    // 通过Keys获取
    getCheckedKeys() {
      if (!this.tree) return
      console.log(this.tree.getCheckedKeys())
    },
    // 通过nodes设置
    setCheckedNodes() {
      this.tree.setCheckedNodes([
        {
          id: '1',
          label: '测试0'
        },
        {
          id: '2',
          label: '测试3'
        }
      ])
    },
    // 通过keys设置
    setCheckedKeys() {
      if (!this.tree) return
      this.tree.setCheckedKeys(['1'])
    },
    // 清空
    resetChecked() {
      if (!this.tree) return
      this.tree.setCheckedKeys([])
    },
    // 懒加载数据
    loadNodes(node, resolve) {
      if (node.level === 0) {
        return resolve(this.list)
      }
      if (node.level > 1) {
        return resolve([])
      }
      const list = [1, 2, 3, 4, 5].map((_, index) => {
        index = index + 1
        return {
          id: '1' + index,
          name: '测试' + index,
          code: '101' + index,
          leaf: true
        }
      })
      resolve(list)
    }
  }
}
</script>
```
:::

### 树节点过滤
通过关键字过滤树节点。

:::demo 在需要对节点进行过滤时，使用filter属性，配置相关的参数，参数text为关键字, 参数flag为二级条件。需要注意的是，此时需要设置filter-node-method(不传即使用默认过滤方法)，值为过滤函数；可参考以下代码。
```html
<template>
  <div>
   <el-input
      style="width: 280px; margin-right: 20px;"
      size="small"
      placeholder="输入关键字进行过滤"
      v-model="filter.text">
    </el-input>
    <el-select v-model="filter.flag" placeholder="请选择" size="small">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>

    <hd-tree
      :root-tree="rootTree"
      treeId="tree1"
      @getTreeRef="getTreeRef"
      :filter="filter">
    </hd-tree>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        {
          id: '1',
          name: '广州市',
          pid: '0',
          code: '101',
          nodeType: 'address'
        },
        {
          id: '2',
          name: '北京市',
          pid: '0',
          code: '104',
          nodeType: 'address'
        },
        {
          id: '3',
          name: '上海市',
          pid: '0',
          code: '103',
          nodeType: 'address'
        }
      ],
      options: [
        { label: '已选中', value: true },
        { label: '未选中', value: false },
        { label: '全部', value: '' }
      ],
      tree: null, // 用于接收返回的树对象
      // 顶层Tree配置
      rootTree: {
        // 属性，使用同el-tree传参方式即可
        attrs: {
          data: [],
          lazy: true, // 启用懒加载
          load: this.loadNodes, // 绑定懒加载数据回调
          'show-checkbox': true // 设置可选择
        },
        // 事件，使用同el-tree传参即可
        listeners: {},
        // 同el-tree的defaultProps，可不传
        defaultProps: {
          children: 'children',
          label: 'name',
          isLeaf: 'leaf' // 自定义，对应数据的字段，需返回boolean
        }
      },
      filter: {
        text: '',
        flag: ''
      }
    }
  },
  methods: {
    getTreeRef(tree, treeId) {
      this.tree = tree
    },
    // 懒加载数据
    loadNodes(node, resolve) {
      if (node.level === 0) {
        return resolve(this.list)
      }
      if (node.level > 1) {
        return resolve([])
      }
      const list = [1, 2, 3, 4, 5].map((_, index) => {
        index = index + 1
        return {
          id: '1' + index,
          name: '测试' + index,
          code: '101' + index,
          leaf: true
        }
      })
      resolve(list)
    }
  }
}
</script>
```
:::

### 鼠标右击弹出菜单
使用@node-contextmenu，slot插槽，具体参考实例。

### Attributes
|      参数     |                                              说明                                              |   类型  | 可选值 |             默认值             |
|---------------|------------------------------------------------------------------------------------------------|---------|--------|--------------------------------|
| treeId        | Tree组件唯一标识，为了区分页面存在多个tree                                                     | String  | ——     | tree                           |
| rootTree      | 顶层Tree配置 attrs: 属性集；listener: 事件集;  如需不想在外部传入，在内部做处理时，覆盖即可    | Object  | ——     | { attrs: {}, listeners: {}}    |
| customTree    | 自定义Tree配置  attrs: 属性集；listener: 事件集;  如需不想在外部传入，在内部做处理时，覆盖即可 | Object  | ——     | { attrs: {}, listeners: {}}    |
| nodeStyleConf | 节点样式配置  root: 父节点；children: 子节点                                                   | Object  | ——     | { root: {}, children: {}}      |
| menuConf      | 菜单配置                                                                                       | Object  | ——     | { headIcon: 'icon-zuzhijigou'} |
| leafConfig    |                                                                                                | Array   | ——     | []                             |
| show          | 菜单显示隐藏                                                                                   | Boolean | ——     | false                          |
| loading       | 加载动画                                                                                       | Boolean | ——     | false                          |
| filter        | 条件过滤                                                                                       | Object  | ——     | { text: '', flag: '' }                               |


### Events
|     事件名称     |        说明        |  回调参数  |
|------------------|--------------------|------------|
| getTreeRef       | 返回树对象和唯一id | 返回2个参数分别是： ref, id    |
| selected-item    | 仅在单选模式有效   | 返回选中值 |
| node-contextmenu | 右键点击节点       | 返回4个参数分别是： event, data, node, tree           |