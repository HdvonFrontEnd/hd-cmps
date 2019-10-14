/**
 * 格式化时间
 * @param date
 * @param format
 */
const formatTime = (date, format = 'yyyy-MM-dd_hh-mm-ss') => {
  const padLeftZero = (str) => {
    return ('00' + str).substr(str.length)
  }
  // 用正则表达式
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      const str = o[k] + ''
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return format
}

/**
 * 获取当前时间的时间戳
 */
const getCurrentTimeStamp = () => {
  return new Date().getTime()
}

export {
  formatTime,
  getCurrentTimeStamp
}
