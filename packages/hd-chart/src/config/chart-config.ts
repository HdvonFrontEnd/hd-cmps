/**
 * 普通柱状图配置
 */
const bar = {
  xAxis: {},
  yAxis: {}
}

/**
 * 横向柱状图配置
 */
const barHorizontal = {
  xAxis: { type: 'value' },
  yAxis: { type: 'category' }
}

/**
 * 普通折线图
 */
const line = {
  tooltip: {
    trigger: 'axis'
  },
  yAxis: { type: 'value' }
}

/**
 * 普通饼图
 */
const pie = {
  xAxis: { show: false },
  yAxis: { show: false }
}

/**
 * 环形饼图
 */
const ring = {
  xAxis: { show: false },
  yAxis: { show: false },
  legend: {},
  title: {
    x: 'center',
    y: '43%',
    textStyle: {
      fontSize: 16
    },
    subtextStyle: {
      fontSize: 24
    }
  }
}

export {
  bar,
  barHorizontal,
  line,
  pie,
  ring
}
