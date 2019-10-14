
## Calendar 日历

排班日历

### 基本用法

:::demo Calendar 日历配置, 详细配置参考 [fullcalendar 官网](https://fullcalendar.io/docs#toc) 文档。
```html
<template>
  <hd-calendar @dateChange="dateChange" :events="events" :height="650"/>
</template>

<script>
export default {
  data() {
    return {
      config: {},
      isShow: false,
      events: []
    }
  },
  mounted() {
    const events = [
      { id: 'event_1', start: '2019-06-20 09:00', end: '2019-06-23 12:00', title: '超级管理员 早班', backgroundColor: '#d181d8', color: '#d181d8' },
      { id: 'event_1', start: '2019-06-20 13:00', end: '2019-06-23 18:00', title: '超级管理员 中班', backgroundColor: '#7f6544', color: '#7f6544' },
      { id: 'event_1', start: '2019-06-20 19:00', end: '2019-06-23 22:00', title: '超级管理员 晚班', backgroundColor: '#e8887f', color: '#e8887f' }
    ]
    setTimeout(() => {
      this.events = events
    }, 5000)
  },
  methods: {
    expand(val) {
      this.isShow = val
    },
    dateChange(e) {
      console.log('dateChange: ', e)
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |                                           说明                                          |   类型  | 可选值 | 默认值 |
|---------------|-----------------------------------------------------------------------------------------|---------|--------|--------|
| config        | calendar配置，详细配置参考 [fullcalendar 官网](https://fullcalendar.io/docs#toc) 文档。 |         |        |        |
| enabledFilter | 是否显示条件筛选的占位                                                                  | Boolean | ——     | true   |
| events        | 事件数据                                                                                | Array   | ——     | ——     |
| height        | 组件容器高度                                                                            | Number  | ——     | ——       |