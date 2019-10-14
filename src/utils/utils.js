// 为了减轻lodash打包时间跟体积
export { default as cloneDeep } from 'node_modules/lodash.clonedeep'
export { default as isEmpty } from 'node_modules/lodash/isEmpty.js'
export { default as union } from 'node_modules/lodash/union.js'
export { default as unionBy } from 'node_modules/lodash/unionBy.js'
export { default as without } from 'node_modules/lodash/without.js'
export { default as debounce } from 'node_modules/lodash/debounce.js'

import { genTreeData as genTree } from 'hd-fun'
// 生成树形数据
export function genTreeData(arr, root = 0, level = 1) {
  return genTree(arr, {
    root: root,
    level: level,
    pid: 'parentId'
  })
}

const genUUID = () => {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

const isIE = () => {
  return !!window.ActiveXObject || 'ActiveXObject' in window
}

const universalAttachEvent = (eventTarget, event, callback, capture = false) => {
  if (isIE()) {
    eventTarget.attachEvent(`on${event}`, callback)
  } else {
    eventTarget.addEventListener(event, callback, capture)
  }
}

const universalDetachEvent = (eventTarget, event, callback, capture = false) => {
  if (isIE()) {
    eventTarget.detachEvent(`on${event}`, callback)
  } else {
    eventTarget.removeEventListener(event, callback, capture)
  }
}

const isTypeOf = (item, type) => {
  const _toString = Object.prototype.toString
  const _map = {
    array: 'Array',
    object: 'Object',
    function: 'Function',
    string: 'String',
    null: 'Null',
    undefined: 'Undefined',
    boolean: 'Boolean',
    number: 'Number'
  }
  const _getType = (item) => {
    return _toString.call(item).slice(8, -1)
  }
  return _map[type] && _map[type] === _getType(item)
}

export {
  genUUID,
  isIE,
  universalAttachEvent,
  universalDetachEvent,
  isTypeOf
}
