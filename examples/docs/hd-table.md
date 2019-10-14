## hd-table

表格

### 基础表格
:::demo 基础表格 使用 **headerSlot** 字段传入插槽自定义表头
```html
<template>
  <hd-table :data="tableData" :columns="columns" align="center">
    <template slot="head" slot-scope="scope">--自定义组合表头{{scope.$index}}</template>
  </hd-table>
</template>

<script>
export default {
  data() {
    return {
      translate: { hd: '弘度' },
      // 基础表格
      tableData: [
        { name: 'hd', country: '中国', city: '广州' },
        { name: 'hd', country: '中国', city: '广州' },
        { name: 'hd', country: '中国', city: '广州' }
      ],
      columns: [
        { attrs: { label: '姓名', prop: 'name', align: 'center', filter: this.enToCn }},
        { attrs: { label: '国籍', prop: 'country', align: 'center' }},
        {
          attrs: { label: '城市', prop: 'city', align: 'center' },
          headerSlot: 'head'
        }
      ]
    }
  },
  methods: {
    enToCn(en) {
      return `${this.translate[en]}(原始值：${en}）`
    }
  }
}
</script>
```
:::

### 带事件表格
:::demo 带事件表格 将 **type 设置为 operations** 来创建一个带事件的表格
```html
<template>
  <hd-table
    :data="tableData"
    :columns="columns"
    @edit="edit"
    @delete="deleteRow"
    align="center"
  ></hd-table>
</template>

<script>
export default {
  name: 'eventTable',
  data() {
    return {
      tableData: [
        { name: 'hd', country: '中国', city: '广州' },
        { name: 'hd', country: '中国', city: '广州' }
      ],
      columns: [
        { attrs: { label: '姓名', prop: 'name', align: 'center' }},
        { attrs: { label: '国籍', prop: 'country', align: 'center' }},
        {
          type: 'operations',
          attrs: {label: '操作', align: 'center' },
          operations: {
            btns: [
              { text: '编辑',event: 'edit',attrs: {size: 'mini'}},
              { text: '删除',event: 'delete',attrs: { size: 'mini'}}
            ]
          }
        }
      ]
    }
  },
  methods: {
    edit(row) {
      console.log('edit: ', row)
    },
    deleteRow(row) {
      console.log('delete: ', row)
    }
  }
}
</script>
```
:::

### 多级表头表格
:::demo 多级表头表格 使用 **children** 来创建一个多级表头的表格
```html
<template>
  <hd-table :data="tableData" :columns="columns" align="center">
    <template slot="city" slot-scope="scope">
      {{scope.row.city}}
    </template>
  </hd-table>
</template>

<script>
export default {
  name: 'mutilTable',
  data() {
    return {
      tableData: [
        { date: '2019-03-25', name: 'hd', province: '广东', city: '广州' },
        { date: '2019-03-25', name: 'hd', province: '广东', city: '广州' }
      ],
      columns: [
        { attrs: { label: '日期', prop: 'date', align: 'center' }},
        { attrs: { label: '姓名', prop: 'name', align: 'center' }},
        {
          attrs: {label: '地址',prop: 'address', align: 'center'},
          children: [
            { attrs: { label: '省份', prop: 'province', align: 'center'}},
            { attrs: { label: '市区', prop: 'city', align: 'center', isChecked: true },slot: 'city'},
            { attrs: { label: '国家', prop: 'name', align: 'center' }}
          ]
        }
      ]
    }
  }
}
</script>
```
:::

### 自定义列模板
:::demo 自定义列模板 使用 **slot** 来创建一个自定义列的表格
```html
<template>
  <hd-table :data="tableData" :columns="columns" align="center">
    <template slot="date" slot-scope="scope">
      自定义{{scope.column.attrs.label}}
    </template>
    <template slot="name" slot-scope="scope">自定义{{scope.column.attrs.label}}</template>
    <template slot="address" slot-scope="scope">自定义{{scope.column.attrs.label}}</template>
  </hd-table>
</template>

<script>
export default {
  name: 'customTable',
  data() {
    return {
      tableData: [
        { date: '2019-03-25', name: 'hd', address: '广东广州' },
        { date: '2019-03-25', name: 'hd', address: '广东广州' }
      ],
      columns: [
        {attrs: { label: '日期', prop: 'date', align: 'center' },slot: 'date'},
        {attrs: { label: '姓名', prop: 'name', align: 'center' },slot: 'name'},
        {attrs: { label: '地址', prop: 'address', align: 'center' },slot: 'address'}
      ]
    }
  }
}
</script>
```
:::

### 展开行表格
:::demo 展开行表格 使用type为 **expand** 来创建一个展开行的表格
```html
<template>
  <hd-table :data="tableData" :columns="columns" align="center">
    <template slot="expand" slot-scope="scope">
      <span>{{scope.row.date}}</span>
      <span>{{scope.row.name}}</span>
    </template>
  </hd-table>
</template>

<script>
export default {
  name: 'expandTable',
  data() {
    return {
      tableData: [
        { date: '2019-03-25', name: 'hd', address: '广东广州' },
        { date: '2019-03-25', name: 'hd', address: '广东广州' }
      ],
      columns: [
        {attrs: { type: 'expand' }, slot: 'expand'},
        {attrs: { label: '日期', prop: 'date', align: 'center' }},
        {attrs: { label: '姓名', prop: 'name', align: 'center' } },
        {attrs: { label: '地址', prop: 'address', align: 'center' }}
      ]
    }
  }
}
</script>
```
:::

### 排序表格
:::demo 排序表格 使用 **sortable** 来创建一个排序的表格
```html
<template>
  <hd-table
    :data="tableData"
    :columns="columns"
    align="center"
    :default-sort="{prop: 'date', order: 'descending'}"
  ></hd-table>
</template>

<script>

export default {
  name: 'sortTable',
  data() {
    return {
      tableData: [
        { date: '2019-03-25', name: 'a', address: '越秀' },
        { date: '2019-03-27', name: 'b', address: '天河' },
        { date: '2019-03-27', name: 'd', address: null },
        { date: '2019-03-27', name: 'e', address: null },
        { date: '2019-03-01', name: 'c', address: '海珠' }
      ],
      columns: [
        { attrs: {label: '日期', prop: 'date',sortable: true,align: 'center'} },
        { attrs: { label: '姓名', prop: 'name',sortable: true,align: 'center'} },
        { attrs: {label: '地址',prop: 'address',sortable: true,sortType: 'pinyin', sortProp: 'address',align: 'center' }}
      ]
    }
  }
}
</script>
```
:::

### 动态列表格
:::demo 排序表格 使用 **dynamicConf** 来创建一个动态列的表格
```html
<template>
  <hd-table 
    :data="tableData"
    :columns="columns"
    :dynamicConf="dynamicConf"
    align="center">
  </hd-table>
</template>

<script>
export default {
  name: 'baseTable',
  data() {
    return {
      // 基础表格
      tableData: [
        { name: 'hd', country: '中国', city: '广州' },
        { name: 'hd', country: '中国', city: '广州' },
        { name: 'hd', country: '中国', city: '广州' }
      ],
      columns: [
        { attrs: { type: 'selection', width: '55' }},
        { attrs: { label: '序号', type: 'index', prop: 'index', width: '55'}},
        { attrs: { label: '姓名', prop: 'name', align: 'center', isChecked: false }},
        { attrs: { label: '国籍', prop: 'country', align: 'center' }},
        { attrs: { label: '城市', prop: 'city', align: 'center' }},
        {
          type: 'operations',
          attrs: { label: '操作', align: 'center' },
          operations: { btns: [{ text: '删除', event: 'delete', attrs: { size: 'mini' }}] }
        }
      ],
      // 动态列配置
      dynamicConf: {
        show: true,
        button: {text: '列', attrs: { size: 'mini' }},
        dropdown: { trigger: 'click' },
        checkbox: { min: 1 }
      },
      checkList: []
    }
  },
  mounted() {
    this.initDynamicColumns()
  },
  methods: {
    changeColumns(list) {
      let obj
      this.columns.forEach(_ => {
        const index = list.findIndex(col => col === _.attrs.prop)
        obj = JSON.parse(JSON.stringify(_))
        obj.attrs.isChecked = index >= 0
        _ = Object.assign(_, obj)
      })
      obj = null
    },
    initDynamicColumns() {
      this.$nextTick().then(() => {
        this.checkList = this.columns.map(_ => {
          return _.attrs.prop
        })
      })
    }
  }
}
</script>
```
:::

### Attributes
| 参数         	| 说明                                                                               	| 类型    	| 可选值         	| 默认值 	|
|--------------	|------------------------------------------------------------------------------------	|---------	|-------------	|--------	|
| columns      	| 列配置，例如`[{ attrs: { label: '姓名', prop: 'name', align: 'center' }}]`详见下表 	  | array   	| —           	| —      	|
| data         	| 表格数据，例如：`[{ name: 'hd', country: '中国', city: '广州' }]`                    	| array   	| —           	| —      	|
| dynamicConf  	| 动态列配置，详见下表                                                                  	| object  	| —           	| —      	|
| scrollTop    	| 是否滚动到顶部                                                                       	| boolean 	| —           	| —      	|
| noWrapHeader 	| 表头是否不换行，表头换行时，在切换动态列时有时候会导致表格高度计算错误                     	| boolean 	| true、false   	| true    |

### columns
表格列配置
| 配置参数   	| 说明                                                                                                                                                 	| 类型   	| 可选项                                       	| 默认值                            	  |
|------------	|---------------------------------------------------------------------------------------------------------          |--------	|----------------------------------------------	|-----------------------------------  |
| type       	| 列的类型                                                                                                           | string 	| operations，slot，filter，或者不填（普通列）    	| 默认不填                          	  |
| attrs      	| 传给element-ui的table-column的配置，详见element-ui文档。此外，新增一些配置，详见下表。                                 	| object 	| —                                            	| { 'show-overflow-tooltip': true } 	|
| operations 	| 按钮配置，例如：`{btns: [{ text: '编辑',event: 'edit',attrs: {size: 'mini'}}]}`，仅对 operations类型有效，详见下表     	| object 	| —                                            	| —                                 	|
| headerSlot 	| 表头插槽的名字,如果有传入,该列的表头将以指定插槽渲染                                                                    | string 	| —                                            	| —                                 	|

### attrs
attrs在element-ui的table-column配置的基础上新增如下配置
| 配置参数      	| 说明                    	| 类型     	| 可选值   	| 默认值 	|
|-----------	|-------------------------	|----------	|----------	|--------	|
| filter    	| 过滤器，即vue中的filter    	| function 	| —        	| —      	|
| isChecked 	| 代表是否显示这一列          	| boolean  	| —        	| true   	|
| sortType  	| 排序类型，可案拼音排序     	| string   	| 'pinyin' 	| —      	|
| sortProp  	| 根据哪一个数据排序          	| string   	| —        	| —      	|

### operations
有待优化，暂不提供文档

### dynamicConf
| 配置参数 	| 说明                                                           	| 默认值                             	|
|----------	|----------------------------------------------------------------	|------------------------------------	|
| show     	| 是否展示动态列按钮                                               	| true                               	|
| button   	| 动态列按钮配置，其中text是按钮文字，attrs为传入el-button的配置      	| `{text: '列',attrs:{size:'mini'}}` 	|
| dropdown 	| 会传给el-dropdown的下拉选择框的配置                              	| `{trigger:'click'}`                	|
| checkbox 	| 会传给el-checkbox-group的配置                                   	| `{min:1}`                          	|