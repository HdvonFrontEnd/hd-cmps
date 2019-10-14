// 清理有问题的数据特殊字符串，例如 | ;
export async function cleanData(str, pArr) {
  const reg = new RegExp(`(${pArr.join('|')})`, 'g')
  return str.replace(reg, ',')
}
// 根据关键字将区域区分
export async function splitRegion(arr, pArr) {
  const res = {}
  pArr.forEach(item => {
    res[item] = []
  })
  arr.forEach(item => {
    pArr.forEach(p => {
      const reg = new RegExp(`.+?${p}$`, 'g')
      console.log(item.org_name.match(reg))
      if (item.org_name.match(reg) && item.org_name.match(reg).length > 0) {
        res[p].push(item)
      }
    })
  })

  return res
}

