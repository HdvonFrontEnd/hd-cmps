import NavList from 'src/nav-list.js'

const loadComponent = name => {
  if (name === 'changelog') {
    return () => import('src/../CHANGELOG.md')
  } else if (name === 'README') {
    return () => import('src/../README.md')
  } else {
    return () => import(`../docs/${name}.md`)
  }
}

const routes = NavList.map(item => ({
  path: item.path,
  name: item.name,
  component: loadComponent(item.name)
}))

export default routes
