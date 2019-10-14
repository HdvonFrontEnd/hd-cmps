# Hd-Cmps

> 弘度 UI 组件库 --- 基于Element-UI


## Build Setup

``` bash

# Clone project
git clone 

# Install dependencies
npm install

# 新建一个组件
npm run add

# 打开文档页面
npm run dev

# build for production with minification
npm run dist

# 全量发布组件
npm run pub

# 分别发布packages内的组件（待调试）
npm run pub:all

# 运行单元测试（单次）
npm run test

# 运行单元测试（会监听文件，多次运行测试）
npm run test:watch

```

## 目录结构

```$xslt
|- hd-cmps
||-- dist
||-- lib
||-- build
||-- docs
||-- examples
||-- packages
|||--- hd-search
||||---- index.js
||||---- example.vue
||||---- README.md
||||---- src
|||||----- hd-search.vue
||-- src
||-- static
||-- test
|||--- unit
||||---- coverage
||||---- specs
```
- dist 中存放构建出来的hd-cmps
- lib 中存放构建出来的调试与文档页面，用于给用户查看例子与文档
- build 中存放了一些脚本与webpack配置
- docs 中存放文档页面相关代码
- examples 中存放调试页面相关代码（不存放组件例子）
- packages 存放组件，以及组件的文档和例子。
- src 中存放组件共用的代码
- static 中存放调试页面用到的静态文件（如大的JSON文件）
- test 中存放测试用例

## 组件库使用方式

你可以引入整个hd-cmps，或者根据需要仅引入部分组件。

### 完整引入

```js
import Vue from 'vue';
import App from './App.vue';
import HdCmps from 'hd-cmps';
import 'hd-cmps/dist/theme/index.css';

Vue.use(HdCmps);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

### 按需引入（推荐）

借助[babel-plugin-component](https://www.npmjs.com/package/babel-plugin-component)我们可以只引入需要的组件，以达到减小项目体积的目的。

首先安装babel-plugin-component：

```bash
npm install babel-plugin-component -D
```

然后将.babelrc修改为：
```json
{
  "presets": [["es2015", { "modules": false }]],
  "plugins": [
    [
      "component",
      {
        "libraryName": "hd-cmps",
        "styleLibrary": {
          "name": "theme",
          "base": false
        },
        "libDir": "dist"
      }
    ]
  ]
}
```

接下来，如果你只希望引入部分组件，比如 HdSearch 和 HdTable，那么需要在 main.js 中写入以下内容：

```js
import Vue from 'vue';
import { HdSearch, HdTable } from 'hd-cmps';
import App from './App.vue';

Vue.component('HdSearch', HdSearch);
Vue.component('HdTable', HdTable);
/* 或写为
 * Vue.use(HdSearch)
 * Vue.use(HdTable)
 */

new Vue({
  el: '#app',
  render: h => h(App)
});

```

完整的组件列表见components.json

## License

MIT
Copyright (c) HDVON 2019-present 
