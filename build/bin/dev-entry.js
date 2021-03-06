const fs = require('fs')
const path = require('path')

function indexEntry() {
  const tips = `/**
 * Automatically generated by '/build/bin/dev-entry.js'
 * CopyRight (C) HDVON.
 * Created by weibin on 2019/03/26
 */
`
  const components = fs.readdirSync(path.resolve(__dirname, '../../packages'))
  const itemList = [`{
    path: 'README',
    name: 'README',
    meta: {
      name: 'README'
    }
  },
  {
    path: 'changelog',
    name: 'changelog',
    meta: {
      name: '更新日志'
    }
  },`]

  components.forEach(name => {
    itemList.push(`{
    path: '${name}',
    name: '${name}',
    meta: {
      name: '${name}'
    }
  },`)
  })

  const content =
    `${tips}
export default [
  ${itemList.join('\n  ').slice(0, -1)}
]
`
  fs.writeFileSync('src/nav-list.js', content)
}

indexEntry()
