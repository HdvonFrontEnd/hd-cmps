<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
export default {
  name: 'app'
}
</script>


<style ref="stylesheet/scss" lang="scss" scoped>
  #app {
    width: 100%;
    height: 100%;
  }
</style>

<!--reset-->
<style ref="stylesheet/scss" lang="scss">
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    -webkit-tap-highlight-color: transparent;

    &.is-component {
      overflow: hidden;
    }
  }

  #app {
    height: 100%;
    overflow: hidden;
    &.is-component {
      overflow-y: hidden;

      .main-cnt {
        padding: 0;
        margin-top: 0;
        height: 100%;
        min-height: auto;
      }

      .headerWrapper {
        position: fixed;
        width: 100%;
        left: 0;
        top: 0;
        z-index: 1500;

        .container {
          padding: 0;
        }
      }
    }
  }

  a {
    color: #409EFF;
    text-decoration: none;
    // 隐藏锚点, 原因： 我们的是hash路由，无法通过hash跳转锚点
    &.header-anchor {
      display: none;
    }
  }

  code {
    background-color: #f9fafc;
    padding: 0 4px;
    border: 1px solid #eaeefb;
    border-radius: 4px;
  }

  button, input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  .main-cnt {
    margin-top: -80px;
    padding: 80px 0 340px;
    box-sizing: border-box;
    min-height: 100%;
  }

  .container,
  .page-container {
    width: 1140px;
    padding: 0;
    margin: 0 auto;
  }

  .page-container {
    h2 {
      font-size: 28px;
      color: #1f2d3d;
      margin: 0;
    }
    h3 {
      font-size: 22px;
    }
    h2, h3, h4, h5 {
      font-weight: normal;
      color: #1f2f3d;

      &:hover a {
        opacity: .4;
      }

      a {
        float: left;
        opacity: 1;
        cursor: pointer;

        &:hover {
          opacity: .4;
        }
      }
    }

    p {
      font-size: 14px;
      color: #5e6d82;
      line-height: 1.5em;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      background-color: #fff;
      font-size: 14px;
      line-height: 1.5em;
      strong {
        font-weight: normal;
      }
      td, th {
        border-bottom: 1px solid #dcdfe6;
        padding: 15px;
        max-width: 250px;
      }
      th {
        text-align: left;
        white-space: nowrap;
        color: #909399;
        font-weight: normal;
      }
      td {
        color: #606266;
      }
      th:first-child, td:first-child {
        padding-left: 10px;
      }
    }
    ul:not(.timeline):not(.el-menu) {
      margin: 10px 0;
      padding: 0 0 0 20px;
      font-size: 14px;
      color: #5e6d82;
      line-height: 2em;
    }

    .tip {
      padding: 8px 16px;
      background-color: #ECF8FF;
      border-radius: 4px;
      border-left: #50bfff 5px solid;
      margin: 20px 0;

      code {
        background-color: rgba(255, 255, 255, .7);
        color: #445368;
      }
    }

    .warning {
      padding: 8px 16px;
      background-color: #fff6f7;
      border-radius: 4px;
      border-left: #FE6C6F 5px solid;
      margin: 20px 0;

      code {
        background-color: rgba(255, 255, 255, .7);
        color: #445368;
      }
    }
  }
  .demo {
    margin: 20px 0;
  }
  @media (max-width: 1140px) {
    .container,
    .page-container {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    .container,
    .page-container {
      padding: 0 20px;
    }

    #app.is-component .headerWrapper .container {
      padding: 0 12px;
    }
  }
</style>

<style lang="scss">
  .hljs {
    line-height: 1.8;
    font-family: Menlo, Monaco, Consolas, Courier, monospace;
    font-size: 12px;
    padding: 18px 24px;
    background-color: #fafafa;
    border: solid 1px #eaeefb;
    margin-bottom: 25px;
    border-radius: 4px;
    -webkit-font-smoothing: auto;
  }
  .page-component__scroll {
    height: calc(100% - 80px);
    margin-top: 80px;
    > .el-scrollbar__wrap {
      overflow-x: auto;
    }
  }
  .page-component {
    box-sizing: border-box;
    height: 100%;

    &.page-container {
      padding: 0;
    }
    .page-component__nav {
      width: 240px;
      position: fixed;
      top: 0;
      bottom: 0;
      margin-top: 80px;
      transition: padding-top .3s;
      > .el-scrollbar__wrap {
        height: 100%;
        overflow-x: auto;
      }
      &.is-extended {
        padding-top: 0;
      }
    }
    .side-nav {
      height: 100%;
      padding-top: 50px;
      padding-bottom: 50px;
      padding-right: 0;
      & > ul {
        padding-bottom: 50px;
      }
    }
    .page-component__content {
      padding-left: 270px;
      padding-bottom: 100px;
      box-sizing: border-box;
    }
    .content {
      padding-top: 50px;
      > {
        h3 {
          margin: 55px 0 20px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          background-color: #fff;
          font-size: 14px;
          margin-bottom: 45px;
          line-height: 1.5em;
          strong {
            font-weight: normal;
          }
          td, th {
            border-bottom: 1px solid #dcdfe6;
            padding: 15px;
            max-width: 250px;
          }
          th {
            text-align: left;
            white-space: nowrap;
            color: #909399;
            font-weight: normal;
          }
          td {
            color: #606266;
          }
          th:first-child, td:first-child {
            padding-left: 10px;
          }
        }
        ul:not(.timeline) {
          margin: 10px 0;
          padding: 0 0 0 20px;
          font-size: 14px;
          color: #5e6d82;
          line-height: 2em;
        }
      }
    }
  }
  @media (max-width: 768px) {
    .page-component {
      .page-component__nav {
        width: 100%;
        position: static;
        margin-top: 0;
      }
      .side-nav {
        padding-top: 0;
        padding-left: 50px;
      }
      .page-component__content {
        padding-left: 10px;
        padding-right: 10px;
      }
      .content {
        padding-top: 0;
      }
      .content > table {
        overflow: auto;
        display: block;
      }
    }
  }
</style>
