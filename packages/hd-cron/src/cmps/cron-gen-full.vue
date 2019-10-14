<template>
  <div class="cron-gen-full-wrapper">
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Seconds.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="second.cronEvery" label="1">{{text.Seconds.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="2">{{text.Seconds.interval[0]}}
              <el-input-number v-bind="$attrs" v-model="second.incrementIncrement" :min="1" :max="60"></el-input-number>
              {{text.Seconds.interval[1]||''}}
              <el-input-number v-bind="$attrs" v-model="second.incrementStart" :min="0" :max="59"></el-input-number>
              {{text.Seconds.interval[2]||''}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="second.cronEvery" label="3">{{text.Seconds.specific}}
              <el-select v-bind="$attrs" multiple v-model="second.specificSpecific">
                <el-option v-for="val in 60" :value="val-1" :key="val">{{val-1}}</el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="second.cronEvery" label="4">{{text.Seconds.cycle[0]}}
              <el-input-number v-bind="$attrs" v-model="second.rangeStart" :min="1" :max="60"></el-input-number>
              {{text.Seconds.cycle[1]||''}}
              <el-input-number v-bind="$attrs" v-model="second.rangeEnd" :min="0" :max="59"></el-input-number>
              {{text.Seconds.cycle[2]||''}}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Minutes.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="minute.cronEvery" label="1">{{text.Minutes.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="2">{{text.Minutes.interval[0]}}
              <el-input-number v-bind="$attrs" v-model="minute.incrementIncrement" :min="1" :max="60"></el-input-number>
              {{text.Minutes.interval[1]}}
              <el-input-number v-bind="$attrs" v-model="minute.incrementStart" :min="0" :max="59"></el-input-number>
              {{text.Minutes.interval[2]||''}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="minute.cronEvery" label="3">{{text.Minutes.specific}}
              <el-select v-bind="$attrs" multiple v-model="minute.specificSpecific">
                <el-option v-for="val in 60" :value="val-1" :key="val">{{val-1}}</el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="minute.cronEvery" label="4">{{text.Minutes.cycle[0]}}
              <el-input-number v-bind="$attrs" v-model="minute.rangeStart" :min="1" :max="60"></el-input-number>
              {{text.Minutes.cycle[1]}}
              <el-input-number v-bind="$attrs" v-model="minute.rangeEnd" :min="0" :max="59"></el-input-number>
              {{text.Minutes.cycle[2]}}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Hours.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="hour.cronEvery" label="1">{{text.Hours.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="2">{{text.Hours.interval[0]}}
              <el-input-number v-bind="$attrs" v-model="hour.incrementIncrement" :min="0" :max="23"></el-input-number>
              {{text.Hours.interval[1]}}
              <el-input-number v-bind="$attrs" v-model="hour.incrementStart" :min="0" :max="23"></el-input-number>
              {{text.Hours.interval[2]}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="hour.cronEvery" label="3">{{text.Hours.specific}}
              <el-select v-bind="$attrs" multiple v-model="hour.specificSpecific">
                <el-option v-for="val in 24" :value="val-1" :key="val">{{val-1}}</el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="hour.cronEvery" label="4">{{text.Hours.cycle[0]}}
              <el-input-number v-bind="$attrs" v-model="hour.rangeStart" :min="0" :max="23"></el-input-number>
              {{text.Hours.cycle[1]}}
              <el-input-number v-bind="$attrs" v-model="hour.rangeEnd" :min="0" :max="23"></el-input-number>
              {{text.Hours.cycle[2]}}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Day.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="day.cronEvery" label="1">{{text.Day.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="2">{{text.Day.intervalWeek[0]}}
              <el-input-number v-bind="$attrs" v-model="week.incrementIncrement" :min="1" :max="7"></el-input-number>
              {{text.Day.intervalWeek[1]}}
              <el-select v-bind="$attrs" v-model="week.incrementStart">
                <el-option v-for="val in 7" :label="text.Week[val-1]" :value="val" :key="val"></el-option>
              </el-select>
              {{text.Day.intervalWeek[2]}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="3">{{text.Day.intervalDay[0]}}
              <el-input-number v-bind="$attrs" v-model="day.incrementIncrement" :min="1" :max="31"></el-input-number>
              {{text.Day.intervalDay[1]}}
              <el-input-number v-bind="$attrs" v-model="day.incrementStart" :min="1" :max="31"></el-input-number>
              {{text.Day.intervalDay[2]}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="day.cronEvery" label="4">{{text.Day.specificWeek}}
              <el-select v-bind="$attrs" multiple v-model="week.specificSpecific">
                <el-option v-for="val in 7"
                           :key="val"
                           :label="text.Week[val-1]"
                           :value="['SUN','MON','TUE','WED','THU','FRI','SAT'][val-1]"
                ></el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="day.cronEvery" label="5">{{text.Day.specificDay}}
              <el-select v-bind="$attrs" multiple v-model="day.specificSpecific">
                <el-option v-for="val in 31" :value="val" :key="val">{{val}}</el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="6">{{text.Day.lastDay}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="7">{{text.Day.lastWeekday}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="8">{{text.Day.lastWeek[0]}}
              <el-select v-bind="$attrs" v-model="day.cronLastSpecificDomDay">
                <el-option v-for="val in 7" :label="text.Week[val-1]" :value="val" :key="val"></el-option>
              </el-select>
              {{text.Day.lastWeek[1]||''}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="9">
              <el-input-number v-bind="$attrs" v-model="day.cronDaysBeforeEomMinus" :min="1" :max="31"></el-input-number>
              {{text.Day.beforeEndMonth[0]}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="10">{{text.Day.nearestWeekday[0]}}
              <el-input-number v-bind="$attrs" v-model="day.cronDaysNearestWeekday" :min="1" :max="31"></el-input-number>
              {{text.Day.nearestWeekday[1]}}
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="day.cronEvery" label="11">{{text.Day.someWeekday[0]}}
              <el-input-number v-bind="$attrs" v-model="week.cronNthDayNth" :min="1" :max="5"></el-input-number>
              <el-select v-bind="$attrs" v-model="week.cronNthDayDay">
                <el-option v-for="val in 7" :label="text.Week[val-1]" :value="val" :key="val"></el-option>
              </el-select>
              {{text.Day.someWeekday[1]}}
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Month.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="month.cronEvery" label="1">{{text.Month.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="2">{{text.Month.interval[0]}}
              <el-input-number v-bind="$attrs" v-model="month.incrementIncrement" :min="0" :max="12"></el-input-number>
              {{text.Month.interval[1]}}
              <el-input-number v-bind="$attrs" v-model="month.incrementStart" :min="0" :max="12"></el-input-number>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="month.cronEvery" label="3">{{text.Month.specific}}
              <el-select v-bind="$attrs" multiple v-model="month.specificSpecific">
                <el-option v-for="val in 12" :label="val" :value="val" :key="val"></el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="month.cronEvery" label="4">{{text.Month.cycle[0]}}
              <el-input-number v-bind="$attrs" v-model="month.rangeStart" :min="1" :max="12"></el-input-number>
              {{text.Month.cycle[1]}}
              <el-input-number v-bind="$attrs" v-model="month.rangeEnd" :min="1" :max="12"></el-input-number>
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> {{text.Year.name}}</span>
        <div class="tabBody">
          <el-row>
            <el-radio v-model="year.cronEvery" label="1">{{text.Year.every}}</el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="year.cronEvery" label="2">{{text.Year.interval[0]}}
              <el-input-number v-bind="$attrs" v-model="year.incrementIncrement" :min="1" :max="99"></el-input-number>
              {{text.Year.interval[1]}}
              <el-input-number v-bind="$attrs" v-model="year.incrementStart" :min="2018" :max="2118"></el-input-number>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio class="long" v-model="year.cronEvery" label="3">{{text.Year.specific}}
              <el-select v-bind="$attrs" filterable multiple v-model="year.specificSpecific">
                <el-option v-for="val in 100" :label="2017+val" :value="2017+val" :key="val"></el-option>
              </el-select>
            </el-radio>
          </el-row>
          <el-row>
            <el-radio v-model="year.cronEvery" label="4">{{text.Year.cycle[0]}}
              <el-input-number v-bind="$attrs" v-model="year.rangeStart"  :min="2018" :max="2118"></el-input-number>
              {{text.Year.cycle[1]}}
              <el-input-number v-bind="$attrs" v-model="year.rangeEnd"  :min="2018" :max="2118"></el-input-number>
            </el-radio>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="preview">cron表达式预览：{{this.cron}}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Language from './language.js'
import { CornParams } from '../models/index' // eslint-disable-line

@Component({
  name: 'cron-gen-full'
})
export default class CronGenFull extends Vue {
  // ==================== Data ====================
  second: CornParams = this.generateModel()
  minute: CornParams = this.generateModel()
  hour: CornParams = this.generateModel()
  day: CornParams = this.generateModel({
    incrementStart: '1',
    incrementIncrement: '1',
    cronLastSpecificDomDay: 1,
    cronDaysBeforeEomMinus: '',
    cronDaysNearestWeekday: ''
  })
  week: CornParams = {
    cronEvery: '',
    incrementStart: '1',
    incrementIncrement: '1',
    specificSpecific: [],
    cronNthDayDay: 1,
    cronNthDayNth: '1'
  }
  month: CornParams = this.generateModel()
  year: CornParams = this.generateModel({ incrementStart: '2017', incrementIncrement: '1' })
  output = {
    second: '',
    minute: '',
    hour: '',
    day: '',
    month: '',
    Week: '',
    year: ''
  }

  // ==================== Computed ====================
  get text() {
    return Language['cn']
  }
  get secondsText(): string {
    let seconds = ''
    const cronEvery = this.second.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        seconds = '*'
        break
      case '2':
        seconds = this.second.incrementStart + '/' + this.second.incrementIncrement
        break
      case '3':
        this.second.specificSpecific.map(val => {
          seconds += val + ','
        })
        seconds = seconds.slice(0, -1)
        break
      case '4':
        seconds = this.second.rangeStart + '-' + this.second.rangeEnd
        break
    }
    return seconds
  }
  get minutesText(): string {
    let minutes = ''
    const cronEvery = this.minute.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        minutes = '*'
        break
      case '2':
        minutes = this.minute.incrementStart + '/' + this.minute.incrementIncrement
        break
      case '3':
        this.minute.specificSpecific.map(val => {
          minutes += val + ','
        })
        minutes = minutes.slice(0, -1)
        break
      case '4':
        minutes = this.minute.rangeStart + '-' + this.minute.rangeEnd
        break
    }
    return minutes
  }
  get hoursText(): string {
    let hours = ''
    const cronEvery = this.hour.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        hours = '*'
        break
      case '2':
        hours = this.hour.incrementStart + '/' + this.hour.incrementIncrement
        break
      case '3':
        this.hour.specificSpecific.map(val => {
          hours += val + ','
        })
        hours = hours.slice(0, -1)
        break
      case '4':
        hours = this.hour.rangeStart + '-' + this.hour.rangeEnd
        break
    }
    return hours
  }
  get daysText(): string {
    let days = ''
    const cronEvery = this.day.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        break
      case '2':
      case '4':
      case '11':
        days = '?'
        break
      case '3':
        days = this.day.incrementStart + '/' + this.day.incrementIncrement
        break
      case '5':
        this.day.specificSpecific.map(val => {
          days += val + ','
        })
        days = days.slice(0, -1)
        break
      case '6':
        days = 'L'
        break
      case '7':
        days = 'LW'
        break
      case '8':
        days = this.day.cronLastSpecificDomDay + 'L'
        break
      case '9':
        days = 'L-' + this.day.cronDaysBeforeEomMinus
        break
      case '10':
        days = this.day.cronDaysNearestWeekday + 'W'
        break
    }
    return days
  }
  get weeksText(): string {
    let weeks = ''
    const cronEvery = this.day.cronEvery
    switch (cronEvery.toString()) {
      case '1':
      case '3':
      case '5':
        weeks = '?'
        break
      case '2':
        weeks = this.week.incrementStart + '/' + this.week.incrementIncrement
        break
      case '4':
        this.week.specificSpecific.map(val => {
          weeks += val + ','
        })
        weeks = weeks.slice(0, -1)
        break
      case '6':
      case '7':
      case '8':
      case '9':
      case '10':
        weeks = '?'
        break
      case '11':
        weeks = this.week.cronNthDayDay + '#' + this.week.cronNthDayNth
        break
    }
    return weeks
  }
  get monthsText(): string {
    let months = ''
    const cronEvery = this.month.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        months = '*'
        break
      case '2':
        months = this.month.incrementStart + '/' + this.month.incrementIncrement
        break
      case '3':
        this.month.specificSpecific.map(val => {
          months += val + ','
        })
        months = months.slice(0, -1)
        break
      case '4':
        months = this.month.rangeStart + '-' + this.month.rangeEnd
        break
    }
    return months
  }
  get yearsText(): string {
    let years = ''
    const cronEvery = this.year.cronEvery
    switch (cronEvery.toString()) {
      case '1':
        years = '*'
        break
      case '2':
        years = this.year.incrementStart + '/' + this.year.incrementIncrement
        break
      case '3':
        this.year.specificSpecific.map(val => {
          years += val + ','
        })
        years = years.slice(0, -1)
        break
      case '4':
        years = this.year.rangeStart + '-' + this.year.rangeEnd
        break
    }
    return years
  }
  get cron(): string {
    return `${this.secondsText || '*'} ${this.minutesText || '*'} ${this.hoursText || '*'} ${this.daysText || '*'} ${this.monthsText || '*'} ${this.weeksText || '?'} ${this.yearsText || '*'}`
  }

  // ==================== Methods ====================
  // 生成对象方法
  generateModel(more = {}) {
    const params = {
      cronEvery: '',
      incrementStart: '3',
      incrementIncrement: '5',
      rangeStart: '',
      rangeEnd: '',
      specificSpecific: []
    }
    return { ...params, ...more }
  }
  // 生成表达式
  generate() {
    return this.cron
  }
  // 重置数据
  reset() {
    this.second = this.generateModel()
    this.minute = this.generateModel()
    this.hour = this.generateModel()
    this.day = this.generateModel({
      incrementStart: '1',
      incrementIncrement: '1',
      cronLastSpecificDomDay: 1,
      cronDaysBeforeEomMinus: '',
      cronDaysNearestWeekday: ''
    })
    this.week = {
      cronEvery: '',
      incrementStart: '1',
      incrementIncrement: '1',
      specificSpecific: [],
      cronNthDayDay: 1,
      cronNthDayNth: '1'
    }
    this.month = this.generateModel()
    this.year = this.generateModel({ incrementStart: '2017', incrementIncrement: '1' })
    this.output = {
      second: '',
      minute: '',
      hour: '',
      day: '',
      month: '',
      Week: '',
      year: ''
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .cron-gen-full-wrapper {
    .el-tabs{
      box-shadow: none;
    }
    .tabBody{
      .el-row{
        margin: 10px 0;
        .long{
          .el-select{
            width:350px;
          }
        }
        .el-input-number{
          width: 110px;
        }
      }
    }
    .preview {
      margin-top: 10px;
    }
  }
</style>
