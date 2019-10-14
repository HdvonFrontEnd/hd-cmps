<template>
  <el-form
    :label-width="'130px'"
    v-bind="$attrs"
    :model="scheduleTime">
    <el-form-item label="执行时间">
      <el-time-picker
        v-model="scheduleTime.timeRange"
        is-range
        value-format="HH:mm"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>
    </el-form-item>
    <el-form-item label="诊断间隔（秒）">
      <el-input-number v-model="scheduleTime.interval" controls-position="right" :min="1" :max="59"></el-input-number>
    </el-form-item>
    <el-form-item label="重复">
      <el-checkbox-group v-model="scheduleTime.weeks">
        <el-checkbox v-for="(item, index) in weeks" :key="index" :label="index">{{item.label}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'cron-gen-simple'
})
export default class CronGenSimple extends Vue {
  // ==================== Data ====================
  weeks = [
    { label: '周一', value: 'MON' },
    { label: '周二', value: 'TUE' },
    { label: '周三', value: 'WED' },
    { label: '周四', value: 'THU' },
    { label: '周五', value: 'FRI' },
    { label: '周六', value: 'SAT' },
    { label: '周日', value: 'SUN' }
  ]
  scheduleTime = {
    timeRange: ['00:00', '23:59'],
    interval: 10,
    weeks: []
  }

  // ==================== Methods ====================
  generate(): string {
    const interval = this.scheduleTime.interval
    const timeRange = this.scheduleTime.timeRange.map(item => item.split(':'))
    const minuteRange = [timeRange[0][1], timeRange[1][1]]
    const minuteRangeStr = Number(minuteRange[1]) - Number(minuteRange[0]) === 59 ? '*' : `${minuteRange[0]}-${minuteRange[1]}`
    const hourRange = [timeRange[0][0], timeRange[1][0]]
    const hourRangeStr = Number(hourRange[1]) - Number(hourRange[0]) === 23 ? '*' : `${hourRange[0]}-${hourRange[1]}`
    const weeks = this.scheduleTime.weeks.map(index => this.weeks[index].value)
    const cron = `0/${interval} ${minuteRangeStr} ${hourRangeStr} * * ${weeks.length ? weeks.join(',') : '?'}`
    return cron
  }
  clearForm(): void {
    this.scheduleTime = {
      timeRange: ['00:00', '23:59'],
      interval: 10,
      weeks: []
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .cron-gen-simple-wrapper {
  }
</style>
