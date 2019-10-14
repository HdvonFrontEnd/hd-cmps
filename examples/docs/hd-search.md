## hd-Search 查询组件

查询组件

### 基础用法
:::demo 基础用法 
```html
<template>
  <hd-search
    size="mini"
    label-width="80px"
    :conditionList="searchOptionList"
    @search="onSearch"
    @reset="onReset"
   />
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    type:'radio',
    options: [
      {label: 'Epic',key: 'epic'},
      {label: '任务',key: 'job'}
    ]
  }
]
export default {
  data() {
    return {
      searchOptionList: conditionList
    }
  },
  methods: {
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::

### 值绑定
:::demo 可使用**v-model**绑定值 
```html
<template>
  <div>
    <hd-search
      v-model="searchData"
      size="mini"
      label-width="80px"
      :conditionList="searchOptionList"
      @search="onSearch"
      @reset="onReset"
     />
     <span>{{searchData}}</span>
  </div>
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    options: [
      {label: 'Epic',key: 'epic'},
      {label: '任务',key: 'job'}
    ]
  }
]
export default {
  data() {
    return {
      searchOptionList: conditionList,
      searchData: {
         type: ['job'],
      }
    }
  },
  methods: {
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::

### 条件隐藏
:::demo 配置项中**stand**属性用来表示该条件是否显示，默认为false
```html
<template>
  <hd-search
    size="mini"
    label-width="80px"
    :conditionList="searchOptionList"
    @search="onSearch"
    @reset="onReset"
   />
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    options: [
      {label: 'Epic',key: 'epic'},
      {label: '任务',key: 'job'}
    ]
  },
  {
    label: '状态',
    key: 'status',
    placeholder: '状态',
    options: [
      {label: '待办', key: 'pending'},
      {label: '已解决',key: 'solved'},
      {label: '已解决2',key: 'solved2'}
    ]
  }
]
export default {
  data() {
    return {
      searchOptionList: conditionList
    }
  },
  methods: {
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::

### 支持的类型
:::demo 支持的基础类型有：多选，单选，输入框，日期，日期段，其它形式可以使用插槽实现 
```html
<template>
  <hd-search
    size="mini"
    label-width="80px"
    :conditionList="searchOptionList"
    @search="onSearch"
    @reset="onReset"
   />
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    options: [
      {label: 'Epic',key: 'epic'},
      {label: '任务',key: 'job'}
    ]
  },
  {
    key: 'keyword',
    label: '查找文本',
    placeholder: '查找文本',
    type: 'input',
    stand: true
  },
  {
    key: 'deviceType',
    label: '设备类型',
    placeholder: '设备类型',
    type: 'radio',
    stand: true,
    options: [
      {key: false,label: '普通摄像机'},
      {key: 'ipc',label: 'IPC'}
    ]
  },
  {
    key: 'time',
    label: '时间选择',
    type:'time',
    placeholder: '请选择',
    stand: true,
    props:{
      pickerOptions: {
        selectableRange: '18:30:00 - 20:30:00'
      }
    }
  },
   {
    key: 'datePicker',
    label: '日期选择',
    placeholder: '选择日期',
    stand: true,
    type: 'datePicker',
    props:{
      type:'datetimerange',
      startPlaceholder:"开始日期",
      endPlaceholder:"结束日期",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    }
  },
  // { 不再维护
  //   key: 'date',
  //   label: '选择日期',
  //   placeholder: '选择日期',
  //   stand: true,
  //   type: 'date'
  // },
  // {
  //   key: 'startTime',
  //   label: '发生开始',
  //   placeholder: '发生开始',
  //   stand: true,
  //   type: 'dateTime'
  // },
  // {
  //   key: 'dateTimeRange',
  //   label: '时间范围',
  //   stand: true,
  //   type: 'dateTimeRange'
  // }
]
export default {
  data() {
    return {
      searchOptionList: conditionList
    }
  },
  methods: {
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::

### 插槽用法
:::demo 支持使用插槽类型 
```html
<template>
  <hd-search
    size="mini"
    label-width="80px"
    :conditionList="searchOptionList"
    @search="onSearch"
    @reset="onReset"
   >
    <template slot="slotTest">
       <el-input size="mini" v-model="test"></el-input>
    </template>
  </hd-search>
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    options: [
      {label: 'Epic',key: 'epic'},
      {label: '任务',key: 'job'}
    ]
  },
  {
    type: 'slot',
    key: 'slotTest',
    stand: true,
    label: '这是插槽'
  }
]
export default {
  data() {
    return {
      searchOptionList: conditionList,
      test: ''
    }
  },
  methods: {
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::

### 自定义tag表现
:::demo 可使用**tagAttrs**设置tag的样式
```html
<template>
  <div >
    <hd-search
      v-model="searchData"
      size="mini"
      label-width="80px"
      :conditionList="searchOptionList"
      @search="onSearch"
      @reset="onReset"
      :tagAttrs="tagAttrs"
     />
    <el-button :size="size" @click="setTag('color','red')">红</el-button>
    <el-button :size="size" @click="setTag('maxWidth',50)">限制宽度</el-button>
    <el-button :size="size" @click="setTag('limitLength',2)">限制个数</el-button>
    <el-tooltip content="点击后移至+3" placement="top">
      <el-button :size="size" @click="setTag('popoverAttrs',{disabled:false})">显示剩余的选中选项</el-button>
    </el-tooltip>
    <el-button :size="size" type="primary" @click="reset">重置</el-button>
  </div>
</template>

<script>
const conditionList = [
  {
    label: '类型',
    key: 'type',
    placeholder: '请选择类型',
    stand: true,
    options: [
      {label: '这是一个名字很长的任务',key: 'epic'},
      {label: '任务',key: 'job'},
      {label: '任务1',key: 'job1'},
      {label: '任务2',key: 'job2'},
      {label: '任务3',key: 'job3'},
      {label: '任务4',key: 'job4'}
    ],
    tagAttrs:{}
  }
]
export default {
  data() {
    return {
      size: 'mini',
      tagAttrs: {},
      searchOptionList: conditionList,   
      searchData: {
         type: ['job','epic','job1','job2'],
      }
    }
  },
  methods: {
    setTag(key,value){
      this.$set(this.searchOptionList[0].tagAttrs, key, value)
    },
    reset(){
      this.searchOptionList[0].tagAttrs = {}
    },
    onSearch(e) {
      this.$message.success('点击了查询按钮')
      console.log(e)
    },
    onReset(e){
      this.$message.success('点击了重置按钮')
      console.log(e)
    }
  }
}
</script> 
```
:::
### Attributes
|      参数     |                                           说明                                      |   类型  | 可选值 | 默认值 |
|---------------|-------------------------------------------------------------------------------------|---------|--------|--------|
| v-model       | 绑定的值                                                         | Object  |        |  |
| conditionList | 表格项配置                                                       | Array  | ——   |   |
| clearable     | 是否可清除                                                         | Boolean  | ——   | true    |
| label-width   | 表头宽度                                                         | String  | ——   |     |
| tagAttrs|tag的配置|Object|——||

### conditionList
配置 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | ---
label | 条件名称 | string | — | —
key | 条件的key | string | — | —
type | 条件的类型 | string | 见下表 | 不填则为多选
placeholder | 占位文字 | string | — | —
stand | 是否常驻，若为否则会被收在“更多”中。 | boolean | true、false | false
options | 选项，仅对单选与多选有效，格式为：`[{label: '任务',key: 'job'}]` | array | — | —
props | 传递给条件组件的element-ui配置，仅对time与datePicker类型有效 | object | — | —

### type
当前支持如下类型的条件
类型 | 说明
--- | ---
— | 不填则为多选
radio | 单选
input | 输入框
time | 时间选择器
datePicker | 时间日期选择器
dateTime | 旧版日期时间选择器（待废除）
timePicker | 旧版时间选择器（待废除）
date | 旧版日期选择器（待废除）
dateTimeRange | 旧版时间日期范围选择器（待废除）
slot | 插槽

### tagAttrs
tag的个性化配置
配置 | 说明 | 类型 | 可选值 | 默认值
--- | --- | --- | --- | ---
limitLength         |'+n'tag的最大出现数                      |number   |—|1
maxWidth            |tag的最大宽度, 文本超出出现省略号    |number   |—|—
isEllipsis          |是否出现'+n'tag                    |boolean  |—|true
disabled            |tag的最大出现数                  |boolean  |—|false
popoverAttrs        |弹出框的属性                     |object   |—|—
type                |类型                             |string|success/info/warning/danger|—
closable            |是否可关闭                      |boolean  |—|true
disable-transitions |是否禁用渐变动画                   |boolean  |—|false
hit                 |是否有边框描边            |boolean  |—|false
color               |背景色                   |string   |—|—
size                |尺寸                     |string   |medium / small / mini|—
effect              |主题                     |string   |dark / light / plain   |—

### popoverAttrs
tag中弹出框的个性化配置

参数	|说明	|类型	|可选值|	默认值
--- | --- | --- | --- | ---
trigger|	触发方式|	String|	click/focus/hover/manual	|hover
title	|标题	|String|	—	|—
width	|宽度	|String, Number	|—|	最小宽度 150px
placement|	出现位置|	String|	top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end|	right-start
disabled|	Popover| 是否可用|	Boolean	|—	|false
offset	|出现位置的偏移量|	Number|	—|	0
transition	|定义渐变动画|	String|	—	|fade-in-linear
visible-arrow	|是否显示 Tooltip 箭头|	Boolean	|—|	true
popper-class	|为 popper 添加类名	|String|	—|	—
open-delay|	触发方式为 hover 时的显示延迟，单位为毫秒	|Number|	—|	—
close-delay|	触发方式为 hover 时的隐藏延迟，单位为毫秒|	number	|—	|200

### Methods
|      方法     |                                           说明                                      | 
|---------------|-------------------------------------------------------------------------------------|
| search | 点击查询按钮触发的函数                                                         | 
| reset  | 点击重置按钮触发的函数                                                       | 
| change | 查询条件发生变化触发的方法                                                    | 

