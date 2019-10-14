## Hd-Form 表单

#### 功能实现
- 在el-form组件基础上做二次封装
- 通过JSON配置表单
- 支持多列配置
- 支持slot插槽
- 通过v-model绑定表单值

### 基本用法
基本的Form表单用法
::: demo 可通过v-model设置表单初始值，表单项值通过`formConfig`项中的`key`关联。`formItemProps`用在表单项的配置，即el-form-item标签的配置。`props`用在具体表单项中的组件的配置，即诸如el-input标签的配置
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    :formConfig="formConfig"
  >
  </hd-form>
  <el-button @click="onSubmit" size="mini" type="primary">提交</el-button>
</template>

<script>
export default {
  name: 'hd-form-example',
  data() {
    return {
      formModel: {
        enable_input: true,
        act_type: '初始值',
        act_location: 'beijing',
        is_set: true,
        counter: 3,
        checkbox_select: ['beijing'],
        editor: '<p>可以通过slot支持富文本</p>'
      },
      formConfig: [
        {
          label: '可配置标题',
          type: 'title'
        },
        {
          label: '是否开启输入框',
          key: 'enable_input',
          type: 'switch',
          formItemProps: {
            'label-width': '120px'
          }
        },
        {
          label: '是否限定',
          key: 'is_set',
          type: 'switch'
        },
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text',
        },
        {
          label: '活动地点',
          key: 'act_location',
          type: 'select',
          props: {
            options: [
              {
                value: 'beijing',
                label: '北京'
              },
              {
                value: 'guangzhou',
                label: '广州'
              }
            ]
          }
        },
        {
          label: '单选组',
          key: 'radio_select',
          type: 'radio-group',
          props: {
            options: [
              {
                value: 'guangzhou',
                label: '广州'
              },
              {
                value: 'shenzhen',
                label: '深圳'
              }
            ]
          }
        },
        {
          label: '多选组',
          key: 'checkbox_select',
          type: 'checkbox-group',
          props: {
            options: [
              {
                value: 'beijing',
                label: '北京'
              },
              {
                value: 'shanghai',
                label: '上海'
              },
              {
                value: 'guangzhou',
                label: '广州',
                disabled: true
              },
              {
                value: 'shenzhen',
                label: '深圳'
              }
            ]
          }
        },
        {
          label: '计数器',
          key: 'counter',
          type: 'number',
          props: {
            min: 2,
            max: 6
          }
        },
        {
          label: '滑块',
          key: 'slider',
          type: 'slider',
          props: {
            min: 2,
            max: 6
          }
        },
        {
          label: '时间选择器',
          key: 'time-picker',
          type: 'time-picker',
          formItemProps: {
            'label-width': '100px'
          },
          props: {
            'is-range': true
          }
        },
        {
          label: '日期选择器',
          key: 'date-picker',
          type: 'date-picker',
          formItemProps: {
            'label-width': '100px'
          },
          props: {
            placeholder: '选择日期时间',
            type: 'datetimerange'
          }
        },
        {
          label: '评分',
          key: 'rate',
          type: 'rate',
          props: {
            'show-text': true
          }
        },
        {
          label: '文件上传',
          key: 'upload',
          type: 'upload',
          props: {
            action: 'https://jsonplaceholder.typicode.com/posts/'
          }
        }
      ]
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!', this.formModel)
    }
  }
}
</script>
```
:::

### 表单插槽
可以根据需要添加组件
::: demo 需要设置`type`为'slot'
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    label-width="120px"
    :formConfig="formConfig"
  >
    <hd-editor
      slot="editor"
      slot-scope="formItemData"
      v-model="formModel[formItemData.formItem.key]"
      v-bind="formItemData.formItem.props"
    ></hd-editor>
  </hd-form>
</template>

<script>
export default {
    data() {
    return {
      formModel: {
        editor: '<p>可以通过slot支持富文本</p>'
      },
      formConfig: [
        {
          label: '富文本插槽',
          key: 'editor',
          type: 'slot',
          required: true,
          props: {
            placeholder: '请输入富文本内容',
            width: '600px'
          }
        }
      ]
    }
  }
}
</script>
```
:::

### 表单项事件监听
监听表单项组件的事件，类似@function的作用
::: demo 可通过配置表单项中的`listeners`监听表单项事件
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    :formConfig="formConfig"
  >
  </hd-form>
</template>

<script>
export default {
  name: 'hd-form-example',
  data() {
    return {
      formModel: {
        act_type: '初始值'
      },
      formConfig: [
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text',
          listeners: {
            focus() {
              console.log('输入框focus!')
            },
            change() {
              console.log('输入框change!')
            }
          },
        }
      ]
    }
  }
}
</script>
```
:::

### 表单项动态渲染
用于控制表单项之间关联的动态渲染
::: demo `ifRender` 默认返回一个model参数，即formModel，用于获取所有表单项的值
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    :formConfig="formConfig"
  >
  </hd-form>
</template>

<script>
export default {
  name: 'hd-form-example',
  data() {
    return {
      formModel: {
        act_type: '初始值',
        enable_input: true
      },
      formConfig: [
        {
          label: '是否开启输入框',
          key: 'enable_input',
          type: 'switch',
          formItemProps: {
            'label-width': '120px'
          }
        },
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text',
          ifRender(model) {
            if (model.enable_input) {
              return true
            } else {
              return false
            }
          }
        }
      ]
    }
  }
}
</script>
```
:::


### 表单项props动态配置
用于动态配置表单项props以及动态改变表单项的值
::: demo `getProps` 默认返回一个model参数，即formModel，用于获取所有表单项的值。`getProps`需要return一个props
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    :formConfig="formConfig"
  >
  </hd-form>
</template>

<script>
export default {
  name: 'hd-form-example',
  data() {
    return {
      formModel: {
        act_type: '初始值',
        is_set: true
      },
      formConfig: [
        {
          label: '是否限定',
          key: 'is_set',
          type: 'switch'
        },
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text',
          getProps(model) {
            if (model.is_set) {
              this.$set(model, 'act_type', '非初始值')
              return { disabled: true }
            } else {
              this.$set(model, 'act_type', '初始值')
              return {}
            }
          }
        }
      ]
    }
  }
}
</script>
```
:::

### 多列表单
可根据业务需求配置多列表单
::: demo `colNum` 分多少列显示，如果设置了`inline`并且`colNum`不为1，那么就会采用分列布局。如果设置了`inline`但不传`colNum`，默认为两列显示。
```html
<template>
  <div class="column-form-wrapper">
    <el-alert
      style="margin-bottom: 20px;"
      :title="infoContent"
      :closable="false"
      type="success">
    </el-alert>
    <el-radio-group v-model="colNum" size="small" style="margin-bottom: 20px;">
      <el-radio-button :label="1">一列</el-radio-button>
      <el-radio-button :label="2">两列</el-radio-button>
      <el-radio-button :label="3">三列</el-radio-button>
    </el-radio-group>
    <hd-form
      class="form"
      ref="form"
      v-model="formModel"
      :inline="true"
      :colNum="colNum"
      :formConfig="formConfig"
      size="mini"
    >
    </hd-form>
  </div>
</template>

<script>
export default {
  name: 'ColumnFormExample',
  data() {
    return {
      infoContent: '需要注意，由于el-form不支持在表单配置了inline的情况下使用滑块组件，hd-form也不支持滑块组件用在分列布局中。（也许还有其他组件存在这种问题）',
      formModel: {},
      colNum: 2,
      formConfig: [
        {
          label: '分组一',
          type: 'title'
        },
        {
          label: '活动地点',
          key: 'act_location',
          type: 'select',
          props: {
            options: [
              {
                value: 'beijing',
                label: '北京'
              },
              {
                value: 'guangzhou',
                label: '广州'
              }
            ]
          }
        },
        {
          label: '单选组',
          key: 'radio_select',
          type: 'radio-group',
          props: {
            options: [
              {
                value: 'guangzhou',
                label: '广州'
              },
              {
                value: 'shenzhen',
                label: '深圳'
              }
            ]
          }
        },
        {
          label: '多选组',
          key: 'checkbox_select',
          type: 'checkbox-group',
          props: {
            options: [
              {
                value: 'beijing',
                label: '北京'
              },
              {
                value: 'shanghai',
                label: '上海'
              },
              {
                value: 'guangzhou',
                label: '广州',
                disabled: true
              }
            ]
          }
        },
        {
          label: '分组二',
          type: 'title'
        },
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text'
        },
        {
          label: '活动地址',
          key: 'act_address',
          type: 'text'
        }
      ]
    }
  }
}
</script>
```
:::

### 表单验证
::: demo 可通过在hd-form传`rules`参数（详细配置参考 [element-ui 官网](https://element.eleme.cn/#/zh-CN/component/form) 文档）或者在`formItemProps`配置`rules`来制定校验规则，可以添加required:true直接设置必填项
```html
<template>
  <hd-form
    class="form"
    size="mini"
    ref="form"
    v-model="formModel"
    :formConfig="formConfig"
  >
  </hd-form>
    <el-button @click="validate" size="mini" type="primary">提交</el-button>
    <el-button @click="resetFields" size="mini">重置</el-button>
</template>

<script>
export default {
  name: 'hd-form-example',
  data() {
    return {
      formModel: {
        act_type: '初始值',
        act_area: ''
      },
      formConfig: [
        {
          label: '活动类型',
          key: 'act_type',
          type: 'text',
          required: true
        },
        {
          label: '活动地点',
          key: 'act_area',
          type: 'text',
          required: true,
          formItemProps: {
            rules: [
              { validator: this.devicePassword }
            ]
          }
        }
      ]
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate().then(res => {
        console.log('表单验证结果-------->', res)
      })
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
    devicePassword(rule, value, callback) {
      if (value) {
        if (value.length < 6 || value.length > 16) callback(new Error('密码长度只能在6到16之间'))
        callback()
      } else {
        callback()
      }
    }
  }
}
</script>
```
:::


### Attributes
以下只列出hd-form的配置，其他详细配置参考 [element-ui 官网](https://element.eleme.cn/#/zh-CN/component/form) 文档

|      参数     |    说明   |   类型  | 可选值 | 默认值 |
|---------------|---------|---------|--------|--------|
| v-model  | 表单绑定值 |   Object  |  —      | —       |
| formConfig | 表单配置（详见下表） | Array | —     | —   |
| inline        | 行内表单模式  | Boolean   | —     | false     |
| colNum        | 表单列数，在`inline`为true时有效 | Number  | —     |  2   |
| labelWidth        | 表单域标签的的宽度，例如 '50px'。支持 auto | String  | —     | '80px' |

### formConfig
formConfig是一个对象数组，里面的每一个对象对应一个表单项或标题。对象的字段说明如下。
| 字段 | 说明 | 可选值 | 默认值 |
| --- | --- | --- | --- |
| label | 表单项标题 | --- | --- |
| type | 表单项类型 | 见下表 | 'text' |
| formItemProps | 传给element-ui的Form-item的配置，详见element-ui文档 | — | — |
| props | 传给element-ui各个表单组件的配置，详见element-ui文档。对于select，radio-group，checkbox-group 类型，在原配置基础上新增一个options配置，值是一个对象数组，例如：`[{value: 'beijing',label: '北京'}`] | — | — |
| required | 是否为必选项，如果设为true则会给表单项的校验规则添加一条必选规则 | true，false | false |
| listeners | 用于给表单项添加事件监听器，例如`listeners: {focus() {console.log('输入框focus!')}}` 会在表单项触发focus事件时执行函数 | — | — |
| getProps | 用于动态配置表单项props的函数，接收一个参数model，为表单的绑定值。返回的对象会与props的值合并，传入对应组件。 | — | — |
| ifRender | 用于控制表单项是否渲染的函数，接收一个参数model，为表单的绑定值。返回true则渲染，否则不渲染 | — | — |

### type
Hd-Form支持下列表单项类型
| type | 说明 |
| --- | --- |
| text | 输入框 |
| select | 选择器 |
| radio-group | 单选组 |
| checkbox-group | 多选组 |
| number | 计数器 |
| switch | 开关 |
| slider | 滑块 |
| time-picker | 时间选择器 |
| date-picker | 日期选择器 |
| rate | 评分 |
| upload | 上传按钮 |
| slot | 插槽 |
| title | 标题 |


### Methods
此处的方法与element-ui的一致，详见element-ui的表单文档

| 方法名 |	说明 |	参数 |
|---------------|---------|---------|
| validate |	对整个表单进行校验 | (callback)，传入callback时会在校验后调用callback，不传时会返回一个Promise |
| resetField |	对该表单项进行重置，将其值重置为初始值并移除校验结果 | - |
| validateField |	对部分表单字段进行校验 | (props, callback)，两个参数， 1. props为待校验表单项的key，可以传入一个key组成的数组用于同时校验多个字段，2. callback为校验结束后的回调 |
| clearValidate |	移除该表单项的校验结果 | (props)，一个参数，1. props为待移除结果的表单项的key，可以传入一个数组代表同时移除多个项的结果 |
