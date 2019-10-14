## TreeGeneral 通用树
针对业务，对hd-tree进行二次封装，更方便使用，简化api

### 基础用法
:::demo 由type属性来选择tree的类型。 可选： checkbox/radio/select 默认为 checkbox
```html
<template>
  <el-row :gutter="40">
    <el-col :span="8">
      <hd-tree-general
        :tree-data="treeData"
        v-model="checkboxTree"
      >
      </hd-tree-general>
    </el-col>
    <el-col :span="8">
      <hd-tree-general
        type="radio"
        :tree-data="treeData"
        v-model="radioTree"
      >
      </hd-tree-general>
    </el-col>
    <el-col :span="8">
      <hd-tree-general
        type="select"
        :tree-data="treeData"
        v-model="selectTree"
      >
      </hd-tree-general>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      checkboxTree: [],
      radioTree: '',
      selectTree: [],
      treeData: [
        {
          "id": "1",
          "name": "广东省",
          "parentId": "0",
          "sort": 1
        },
        {
          "id": "2",
          "name": "江苏省",
          "parentId": "0",
          "sort": 2
        },
        {
          "id": "3",
          "name": "广州市",
          "parentId": "1",
          "sort": 1
        },
        {
          "id": "4",
          "name": "东莞市",
          "parentId": "1",
          "sort": 2
        }
      ]
    }
  }
}
</script>
```
:::

### 自定义搜索条件
:::demo 通过filterable关闭自带的搜索栏，自主传入filter
```html
<template>
  <div class="filter-demo">
    <el-form
      :model="filter"
      :inline="true"
      size="small"
      >
      <el-form-item label="包含文本">
        <el-input v-model="filter.text" placeholder="请输入" clearable></el-input>
      </el-form-item>
      <el-form-item label="已选">
        <el-select v-model="filter.flag" placeholder="请选择">
          <el-option
            v-for="item in flagList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <hd-tree-general
      :filterable="false"
      :tree-data="treeData"
      v-model="tree"
      :filter="filter"
    >
    </hd-tree-general>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tree: [],
      filter: { text: null, flag: null },
      flagList: [
        { value: '', label: '全部' },
        { value: true, label: '是' },
        { value: false, label: '否' }
      ],
      treeData: [
        {
          "id": "1",
          "name": "广东省",
          "parentId": "0",
          "sort": 1
        },
        {
          "id": "2",
          "name": "江苏省",
          "parentId": "0",
          "sort": 2
        },
        {
          "id": "3",
          "name": "广州市",
          "parentId": "1",
          "sort": 1
        },
        {
          "id": "4",
          "name": "东莞市",
          "parentId": "1",
          "sort": 2
        }
      ]
    }
  }
}
</script>
```
:::

### 添加icon
:::demo 通过给数据增加字段 prependSlot 定义
```html
<template>
  <hd-tree-general
    type="select"
    :filterable="false"
    :tree-data="treeData"
    v-model="tree"
  >
  </hd-tree-general>
</template>

<script>
export default {
  data() {
    return {
      tree: [],
      treeData: [
        {
          "id": "1",
          "name": "系统设置",
          "parentId": "0",
          "sort": 1,
          "prependSlot": {
            "tooltipName": "设置",
            "iconName": "el-icon-setting",
            "style": { "fontSize": "13px", "color": "#409EFF" }
          }
        },
        {
          "id": "2",
          "name": "软件更新",
          "parentId": "1",
          "sort": 1
        }
      ]
    }
  }
}
</script>
```
:::

### Attributes 
|        参数        |               说明               |     类型     |        可选值         |  默认值  |
|--------------------|----------------------------------|--------------|-----------------------|----------|
| vale/model         | 绑定值                           | Array/String | ——                    | ——       |
| type               | 类型                             | String       | checkbox/radio/select | checkbox |
| tree-data          | 树的数据                         | Array        | ——                    | []       |
| tag-config         | 给指定的树打tag                  | Object       | ——                    | {}       |
| inner-style        | 给内部的hd-tree的样式            | Object       | ——                    | {}       |
| filter-node-method | 传入一个方法，过滤掉不需要的数据 | Function     | ——                    | ——       |
| check-strictly     | 是否层级关联                     | Boolean      | ——                    | false    |
| tree-structure     | 是否需要树结构计算               | Boolean      | ——                    | true     |
| filterable         | 是否需要搜索框                   | Boolean      | ——                    | true     |
| filter             | 搜索条件                         | Object       | ——                    | { text: null, // 相关文本 flag: null // 是否为选中 }         |


### Events
| 事件名称 |           说明           |  回调参数  |
|----------|--------------------------|------------|
| selected | 当绑定值变化时触发的事件 | 更新后的值 |