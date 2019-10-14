const inquirer = require('inquirer')
const chalk = require('chalk')
const branch = require('git-branch')
const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')
const packageJSON = require('../package.json')
// const GitHubApi = require('@octokit/rest')
let newVersionStr
// let changelog

const init = () => {
  console.log(chalk.green('Releasing a new version of [hd-cmps]'))
}

const gitAdd = () => {
  execSync(`git add ${path.join(__dirname, '../package.json')}`)
  execSync(`git add ${path.join(__dirname, '../CHANGELOG.md')}`)
  console.log(chalk.blue('-----------✔ git add packegs.json 与 CHANGELOG.md-----------'))
}

const gitPush = (branch) => {
  execSync(`git push -u origin ${branch} --tags`)
  console.log(chalk.blue('-----------✔ git push-----------'))
}

const gitCommit = (prompt) => {
  // execSync('git commit -m "' + prompt + '"')
  execSync(`git commit -m "${prompt}"`)
  console.log(chalk.blue('-----------✔ git commit-----------'))
}

const gitTag = (tag) => {
  execSync(`git tag ${tag}`)
  console.log(chalk.blue('-----------✔ git tag-----------'))
}

const askQuestion = () => {
  const questions = [
    {
      name: 'releaseType',
      type: 'list',
      message: '请选择release类型',
      choices: [{ name: 'Major(x)', value: 0 }, { name: 'Minor(0.x)', value: 1 }, { name: 'Patch(0.0.x)', value: 2 }]
    },
    {
      name: 'npmRegistry',
      type: 'input',
      message: '请输入npm registry',
      default: 'https://registry.npmjs.org'
    }
  ]

  return inquirer.prompt(questions)
}

const setupVersion = async(index) => {
  const version = packageJSON.version.split('.').map(item => +item)
  version[index]++
  while (version[index + 1] !== undefined) {
    version[++index] = 0
  }
  newVersionStr = version.join('.')
  const question = [
    {
      name: 'setVersion',
      type: 'confirm',
      message: `版本变动：\n${packageJSON.version} ==> ${newVersionStr}\n是否确定发布？`
    }
  ]
  const { setVersion } = await inquirer.prompt(question)
  if (setVersion) {
    packageJSON.version = newVersionStr
    fs.writeFileSync(path.join(__dirname, '../package.json'), JSON.stringify(packageJSON, null, 2))
    console.log(chalk.blue('-----------✔ 修改版本-----------'))
  }
  return setVersion
}

const generateChangelog = () => {
  execSync('npm run changelog')
  // changelog = execSync('conventional-changelog -p angular') // 不传入文件信息，直接获取标准输出
  console.log(chalk.blue('-----------✔ changelog 生成-----------'))
}

const validateGitStatus = () => {
  // 检查一下当前分支，
  // 如果不在develop分支就报错
  // 或者在develop分支，但是有未commit的改动
  // 又或者与远程分支不同步
  function inDevelopBranch() {
    const currentBranch = branch.sync()
    return currentBranch === 'develop'
  }

  function hasUncommit() {
    const successStr = 'untracked'
    const result = execSync(`git diff-index --quiet HEAD -- || echo "${successStr}"`, { encoding: 'utf-8' })
    const targetRes = execSync(`echo "${successStr}"`, { encoding: 'utf-8' })
    return result === targetRes
  }

  function needToPull() {
    // 参考：https://stackoverflow.com/questions/17719829/check-if-local-git-repo-is-ahead-behind-remote
    const local = execSync('git rev-parse @', { encoding: 'utf-8' })
    const remote = execSync('git rev-parse @{u}', { encoding: 'utf-8' })
    const base = execSync('git merge-base @ @{u}', { encoding: 'utf-8' })
    if (local !== remote && local === base) {
      return true
    } else {
      return false
    }
  }

  if (!inDevelopBranch()) {
    console.log(chalk.red('-----------✘ 请先切换到develop分支-----------'))
    return false
  }

  if (hasUncommit()) {
    console.log(chalk.red('-----------✘ 有尚未commit的改动-----------'))
    return false
  }

  if (needToPull()) {
    console.log(chalk.red('-----------✘ 远程有更新，请先拉取最新代码-----------'))
    return false
  }

  return true
}

const checkoutMaster = () => {
  // 先切到master，同步线上的， 然后合并develop
  execSync('git checkout master && git pull origin master --tags && git merge develop')
  console.log(chalk.blue('-----------✔ git checkout master && git pull origin master --tags && git merge develop-----------'))
}

const rebaseMaster = () => {
  // 再切回 develop，并rebase 一下master， 注意，主要自己同步到线上
  execSync('git checkout develop && git rebase master && git push origin develop')
  console.log(chalk.blue('-----------✔ git checkout develop && git rebase master && git push origin develop-----------'))
}

// 今后改为手动维护 release note
// const writeGithubReleaseMessage = () => {
//   const github = new GitHubApi({
//     baseUrl: 'https://api.github.com',
//     auth: `token ${process.env.GITHUB_TOKEN}`
//   })
//   github.repos.createRelease({
//     owner: 'HdvonFrontEnd',
//     repo: 'hd-cmps',
//     tag_name: `v${newVersionStr}`,
//     name: `Release: ${newVersionStr}`,
//     body: changelog.toString(),
//     draft: false,
//     prerelease: false
//   })
//   console.log(chalk.blue('-----------✔ 生成 release note-----------'))
// }

const success = () => {
  console.log(chalk.white.bgGreen.bold(`DONE! A new version of hd-cmps has been published`))
}

const run = async() => {
  if (!validateGitStatus()) return

  // 开始之前先回到master分支
  checkoutMaster()

  init()

  const { releaseType, npmRegistry } = await askQuestion()

  const res = await setupVersion(releaseType)

  if (res) {
    await generateChangelog()

    await gitAdd()

    await gitCommit('chore(release): publish')

    await gitTag(`v${newVersionStr}`)

    await gitPush(branch.sync())

    execSync('npm run dist', { stdio: 'inherit' })
    console.log(chalk.blue('-----------✔ 构建完成-----------'))
    execSync(`npm publish --registry=${npmRegistry}`)
    console.log(chalk.blue(`-----------✔ 发布完成，发布在：${npmRegistry}-----------`))

    // 结束之后回到develop分支
    rebaseMaster()

    // writeGithubReleaseMessage()

    success()
  }
}

run()
