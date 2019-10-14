## TreeDropdown 下拉树
针对业务，对hd-tree-general进行封装，方便使用

### 基础用法
:::demo
```html
<template>
  <div style="width: 300px;">
    <hd-tree-dropdown
      v-model="tree"
      placeholder="请选择"
      size="small"
      :tree-attrs="treeAttrs"
    >
    </hd-tree-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tree: [],
      treeAttrs: {
        type: 'checkbox',
        tagConfig: {
          data: [
            { isCapital: true, tagName: '省会' }
          ]
        },
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
            "isCapital": true,
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
}
</script>
```
:::

### Attributes 
|     参数    |                      说明                     |     类型     |        可选值         | 默认值 |
|-------------|-----------------------------------------------|--------------|-----------------------|--------|
| vale/model  | 绑定值                                        | Array/String | ——                    | ——     |
| size        | 尺寸                                          | String       | medium / small / mini | mini   |
| disabled    | 控制form表单元素是否被禁用                    | Boolean      | ——                    | false  |
| placeholder | 占位符                                        | String       | ——                    | 请选择 |
| tree-attrs  | hd-tree-general的配置，具体可查看该组件的属性 | Object       | ——                    | ——       |

### Events
| 事件名称 |           说明           |  回调参数  |
|----------|--------------------------|------------|
| selected | 当绑定值变化时触发的事件 | 更新后的值 |