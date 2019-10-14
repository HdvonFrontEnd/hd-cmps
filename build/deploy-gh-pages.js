const execSync = require('child_process').execSync
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const buildStatic = () => {
  process.env.GITHUB_PAGES = 'gh-pages'
  execSync('npm run deploy:build', { stdio: 'inherit' })
}

const branchManipulate = () => {
  fs.mkdirSync(path.join(process.cwd(), './temp_ci'))
  process.chdir(path.join(process.cwd(), './temp_ci'))
  execSync('git clone --depth 1 -b gh-pages --single-branch https://github.com/HdvonFrontEnd/hd-cmps.git', { stdio: 'inherit' })
  process.chdir(path.join(process.cwd(), './hd-cmps'))
  rimraf.sync('./**/*')
  execSync('cp -rf ../../lib/** .')
  execSync('git add -A .', { stdio: 'inherit' })
  execSync('git commit -m "chore: build a new github page"', { stdio: 'inherit' })
  execSync('git push origin gh-pages -f', { stdio: 'inherit' })
}

const cleanUp = () => {
  process.chdir(path.join(process.cwd(), '../../'))
  rimraf.sync('./temp_ci')
}

const run = () => {
  buildStatic()
  branchManipulate()
  cleanUp()
}

run()
