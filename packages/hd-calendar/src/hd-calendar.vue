<template>
	<div class="hd-calendar-wrapper">
		<div class="filter-box" v-if="enabledFilter">
			<slot name="filter"></slot>
		</div>
		<FullCalendar ref="fullCalendar" v-bind="getConfig" v-on="$listeners"/>
	</div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Emit } from 'vue-property-decorator'
import FullCalendar from '@fullcalendar/vue'
import calendarOptions from './config'
import { CalendarOptions, CalendarApi } from './models/index' // eslint-disable-line

@Component({
  name: 'hd-calendar',
  components: {
    FullCalendar
  }
})
export default class HdCalendar extends HdCmpsComponent {
  // ==================== Props ====================
  // calendar配置，详细配置参考FullCalendar文档
  @Prop({ type: Object, default: () => ({}) }) config: {}
  // 是否显示条件筛选的占位
  @Prop({ type: Boolean, default: true }) enabledFilter: boolean
  // 事件数据
  @Prop({ type: Array, default: true }) events: []
  // 组件容器高度
  @Prop({ type: Number }) height: number

  // ==================== Data ====================
  calendarOptions: CalendarOptions = calendarOptions
  calendarApi: CalendarOptions // calendar api对象
  next: HTMLButtonElement | null // 向下按钮
  prev: HTMLButtonElement | null // 向上按钮

  // ==================== Computed ====================
  // 获取配置
  get getConfig() {
    if (this.config) {
      // 需要使用深拷贝，不能使用JSON解析
      this.calendarOptions = Object.assign(this.calendarOptions, this.config)
    }
    if (this.events && this.events.length > 0) {
      this.calendarOptions.events = this.events
    }
    if (this.height) {
      this.calendarOptions.height = this.height
    }
    return this.calendarOptions
  }

  // ==================== 生命周期 ====================
  mounted(): void {
    this.initApi()
  }
  destroyed() {
    // 释放监听的事件
    if (this.next && this.prev) {
      this.next.removeEventListener('click', this.dateChange)
      this.prev.removeEventListener('click', this.dateChange)
      this.next = null
      this.prev = null
    }
  }

  // ==================== Emits ====================
  @Emit('calendarApi') // 暴露日历的api
  onCalendarApiEmit(val) {
    return val
  }
  @Emit() // 切换日期返回当前时间
  dateChange() {
    return this.calendarApi.getDate()
  }
  @Emit() // 日历天的点击事件
  dayClick(e) {
    return e
  }
  @Emit('events') // 单项的点击事件
  eventClick(e) {
    return e
  }

  // ==================== Methods ====================
  // 初始化获取api
  initApi() {
    this.calendarApi = (this.$refs.fullCalendar as CalendarApi).getApi()
    this.onButtonEvent()
    // 暴露日历的api
    this.onCalendarApiEmit(this.calendarApi)
  }
  // 手动监听日期时间的左右切换事件
  onButtonEvent() {
    this.next = document.querySelector('.fc-next-button')
    if (this.next) {
      this.next.addEventListener('click', this.dateChange)
    }
    this.prev = document.querySelector('.fc-prev-button')
    if (this.prev) {
      this.prev.addEventListener('click', this.dateChange)
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss">
@import '~@fullcalendar/core/main.css';
@import '~@fullcalendar/daygrid/main.css';

.hd-calendar-wrapper {
	position: relative;
	/* =============  重置日历样式  ==============*/
  .fc {
    th {
      padding: 14px 0;
    }
    .fc-content {
      display: flex;
      flex-wrap: wrap;
    }
    .fc-time {
      margin-right: 6px;
    }
  }
  .fc-popover {
    .fc-widget-header {
      padding: 10px;
    }
    .fc-event {
      &+.fc-event {
        margin-top: 5px;
      }
    }
  }
  .fc-center {
    display: flex;
    align-items: center;
    .fc-button {
      &.fc-button-primary, &.fc-button-primary:not(:disabled):active {
        background-color: transparent; /*ie不兼容initial属性*/
        border-color: transparent;
        color: #cccccc;
        border: none;
        box-shadow: none;
      }
    }
  }
	.filter-box {
		position: absolute;
		top: 10px;
		right: 10px;
	}
}
</style>
