const tooltip = {
  trigger: 'item',
  confine: true
}

const xAxis = {
  type: 'category'
}

const yAxis = {
  type: 'value'
}

const legend = {
  show: true
}

const grid = {
  containLabel: true
}

const toolbox = {
  show: true,
  feature: {
    magicType: { type: ['line', 'bar'] },
    restore: {}
  }
}

export {
  tooltip,
  xAxis,
  yAxis,
  legend,
  grid,
  toolbox
}
