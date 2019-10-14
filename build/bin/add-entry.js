const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')
const render = require('json-templater/string')
const uppercamelcase = require('uppercamelcase')
const path = require('path')
const OUTPUT_PATH = path.join(__dirname, `../../packages`)

const INDEX_TEMPLATE = `import '@babel/polyfill'
import {{camelName}} from './src/{{name}}.vue'

({{camelName}} as any).install = function(Vue): void {
  Vue.component('{{camelName}}', {{camelName}})
}

export default {{camelName}}
`
const VUE_TEMPLATE = `<template>
	<div class="{{name}}-wrapper"></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
@Component
export default class {{camelName}} extends Vue {}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.{{name}}-wrapper {
	}
</style>
`

const init = () => {
  console.log(chalk.green('Create relate files for adding a new package'))
}

const askQuestions = () => {
  const questions = [
    {
      name: 'PACKAGENAME',
      type: 'input',
      message: 'What\'s the name of your package?'
    }
  ]

  return inquirer.prompt(questions)
}

const createFile = (packageName) => {
  const PACKAGE_PATH = path.join(OUTPUT_PATH, `/${packageName}`)
  // 创建目录
  fs.mkdirSync(path.join(PACKAGE_PATH, '/src'), { recursive: true })

  // 创建index.ts
  fs.writeFileSync(path.join(PACKAGE_PATH, '/index.ts'), render(INDEX_TEMPLATE, {
    camelName: uppercamelcase(packageName),
    name: packageName
  }))

  // 创建组件
  fs.writeFileSync(path.join(PACKAGE_PATH, `src/${packageName}.vue`), render(VUE_TEMPLATE, {
    camelName: uppercamelcase(packageName),
    name: packageName
  }))

  // 创建examples/docs
  fs.writeFileSync(path.join(__dirname, `../../examples/docs/${packageName}.md`), '## 新建组件，请补全文档')

  return PACKAGE_PATH
}

const success = (filePath) => {
  console.log(chalk.white.bgGreen.bold(`DONE! Relate files had been created at: ${filePath}`))
}

const run = async() => {
  // show script introduction
  init()
  // ask questions
  const answers = await askQuestions()
  const { PACKAGENAME } = answers
  // create the file
  const filePath = createFile(PACKAGENAME)
  // show success message
  success(filePath)
}

run()
