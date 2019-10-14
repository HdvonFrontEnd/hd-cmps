import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  // schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source', // license key
  timeZone: 'UTC', // 时区
  defaultView: 'dayGridMonth', // 默认视图
  locale: 'zh-cn', // 国际化语言
  height: 'parent', // 高度适配
  // contentHeight: 'auto', // 内容高度适配
  plugins: [dayGridPlugin, interactionPlugin], // 插件使用
  header: { // 组件的头部配置
    left: '', // 左侧
    center: 'prev, title, next', // 中间
    right: 'filter' // 右侧
  },
  editable: true, // 是否可编辑
  droppable: true, // 是否可拖拽
  eventLimit: true, // 事件数据是否分页(查看更多)
  eventLimitText: '查看更多', // 查看更多按钮文本
  displayEventEnd: true, // 是否显示时间的结束时间
  eventOrder: 'title,start,-duration,allDay', // 事件记录的排序
  eventTimeFormat: { // like '14:30:00'
    hour: '2-digit',
    minute: '2-digit'
  },
  eventRender: function(info) { // 对应数据渲染，可增加一些tooptip等插件
  },
  events: [ // put the array in the `events` property
    // {
    //   id: 'event1',
    //   title: '超级管理员 午班 ',
    //   start: '2019-06-01 13:40',
    //   end: '2019-06-01 18:00'
    // }
  ]
}
