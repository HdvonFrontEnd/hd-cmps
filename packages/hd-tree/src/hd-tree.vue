<template>
  <div class="directory-tree-wrapper" v-loading="loading">
    <el-tree
      :ref="treeId"
      node-key="id"
      :props="treeProps"
      :filter-node-method="rootTree.attrs['filter-node-method'] || filterNode"
      v-bind="rootTree.attrs"
      :show-checkbox="rootTree.attrs['show-checkbox'] || rootTree.type === 'checkbox'"
      v-on="rootTree.listeners"
      @node-contextmenu="nodeRightClick"
    >
      <!--注意：此处的height:0，是为了兼容火狐的flex布局，去掉的话，左侧树在火狐里就无法自适应，不会出现滚动条-->
      <span
        class="custom-tree-node"
        :title="rootTree.defaultProps ? data[rootTree.defaultProps.label] : data.label"
        slot-scope="{ node, data }"
        v-bind="customTree.attrs"
        v-on="customTree.listeners"
      >
        <!-- 如果存在radio配置，即视为radio模式, 不传为默认 -->
        <template v-if="rootTree && rootTree.type === 'radio' && rootTree.radio">
          <el-radio
            v-if="rootTree.radio.type === 'multiple'"
            v-model="rootTree.radio.model"
            :disabled="data['disabled']"
            :label="data[rootTree.radio.value || 'id']"
            @change="clickRadio(data)"
          >
           <slot :node="node" :data="data" name="prepend"></slot>
            <tree-icon :node-data="data" v-bind="nodeStyleConf"/>
            {{ data[rootTree.radio.label || 'name'] }}
             <slot :node="node" :data="data" name="append"></slot>
          </el-radio>
          <el-radio
            v-else
            v-model="rootTree.radio.model"
            :disabled="data['disabled']"
            :label="data[rootTree.radio.value || 'id']"
            @change="rootTree.radio.change"
          >
            <slot :node="node" :data="data" name="prepend"></slot>
            <tree-icon :node-data="data" v-bind="nodeStyleConf"/>
            {{ data[rootTree.radio.label || 'name'] }}
            <slot :node="node" :data="data" name="append"></slot>
          </el-radio>
        </template>
        <!-- 默认显示 -->
        <span v-else>
          <slot :node="node" :data="data" name="prepend"></slot>
          <tree-icon :node-data="data" v-bind="nodeStyleConf"/>
          {{ rootTree.defaultProps ? data[rootTree.defaultProps.label] : data.label }}
          <slot :node="node" :data="data" name="append"></slot>
        </span>
        <tree-tag :node-data="data" v-bind="$attrs['tag-config']"/>
      </span>
    </el-tree>
    <div
      ref="contextMenu"
      class="menu-wrapper"
      :style="posStyle"
      v-show="clickMenuVisible"
      v-clickOutside="() => { clickMenuVisible = false }"
      @contextmenu.prevent
      @click.stop="handlerMenu(false)"
    >
      <slot name="rightClickMenu">
        <div class="rightClickMenuWrapper">
          <div class="contextMenuHead" v-show="menuConf.headIcon">
            <div class="contextMenuHeadImg">
              <i class="iconfont" :class="menuConf.headIcon"></i>
            </div>
          </div>
          <div
            class="contextMenuItem"
            v-for="(item, index) in menuConf.menuItems"
            :key="index"
            @click="menuConf.listeners && menuConf.listeners.click(item)"
          >
            <i class="iconfont" :class="item.class"></i>
            <span class="contextMenuText">{{item.text}}</span>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Watch, Emit } from 'vue-property-decorator'
import TreeIcon from './comp/TreeIcon.vue'
import TreeTag from './comp/TreeTag.vue'
import clickOutside from 'element-ui/src/utils/clickoutside'
import { TreeModel, FilterModel } from './models/index' //eslint-disable-line

@Component({
  name: 'hd-tree',
  components: {
    TreeIcon,
    TreeTag
  },
  // 指令管理
  directives: { clickOutside }
})
export default class HdTree extends HdCmpsComponent {
  // Tree组件唯一标识，为了区分页面存在多个tree
  @Prop({ type: String, default: 'tree' }) treeId: string
  // 顶层Tree配置 attrs: 属性集；listener: 事件集;  如需不想在外部传入，在内部做处理时，覆盖即可
  @Prop({ type: Object, default: () => ({ attrs: {}, listeners: {}}) }) rootTree: TreeModel
  // 自定义Tree配置  attrs: 属性集；listener: 事件集;  如需不想在外部传入，在内部做处理时，覆盖即可
  @Prop({ type: Object, default: () => ({ attrs: {}, listener: {}}) }) customTree: TreeModel
  // 节点样式配置  root: 父节点；children: 子节点
  @Prop({ type: Object, default: () => ({ root: {}, children: {}}) }) nodeStyleConf: object
  // 菜单配置 headIcon: 菜单顶部图标
  @Prop({ type: Object, default: () => ({ headIcon: 'icon-zuzhijigou' }) }) menuConf: object
  // 展开子节点配置
  @Prop({ type: Array, default: () => ([]) }) leafConfig: []
  // 菜单开关
  @Prop({ type: Boolean, default: false }) show: boolean
  // 加载动画
  @Prop({ type: Boolean, default: false }) loading: boolean
  // 条件过滤 text: 过滤关键字, flag: 二级条件 true: 已选择， false: 未选择，空值: 全选
  @Prop({ type: Object, default: () => ({ text: '', flag: '' }) }) filter: FilterModel

  // data管理
  treeProps = this.getDefaultProps()
  radioValue = '' // 单选框值
  clickMenuVisible = false // 菜单显示隐藏
  posX = 0 // 菜单出现位置: X轴
  posY = 0 // 菜单出现位置: Y轴
  posStyle = {}

  @Watch('filter', { deep: true })
  onFilterChanged(nval: FilterModel) {
    (this.$refs[this.treeId] as TreeModel).filter(nval.text)
  }
  @Watch('clickMenuVisible')
  onClickMenuVisibleChanged(val) {
    this.clickMenuVisible = val
    if (val) {
      this.$nextTick(() => {
        this.isExceed()
      })
    }
  }

  // 生命周期
  public mounted() {
    // 返回树对象和唯一id
    if (this.treeId) {
      this.$emit('getTreeRef', this.$refs[this.treeId], this.treeId)
    }
  }

  // 选中单选框
  @Emit('selected-item')
  clickRadio(data: TreeModel) {
    return data
  }

  // 组合tree默认属性
  getDefaultProps(): TreeModel {
    const defalutProps = {
      children: 'children',
      label: 'name',
      isLeaf: this.isLeaf
    }
    return Object.assign(defalutProps, this.rootTree.defaultProps || {})
  }

  // 右键点击节点
  nodeRightClick(event, data, node, tree): void {
    if (!this.show) return
    this.$emit('node-contextmenu', event, data, node, tree)
    this.posX = event.clientX
    this.posY = event.clientY
    this.posStyle = {
      top: `${this.posY}px`,
      left: `${this.posX}px`
    }
    this.handlerMenu(true)
  }

  // 判断菜单是否超出屏幕
  isExceed(): void {
    const contextMenu = this.$refs.contextMenu as HTMLDivElement
    const contextMenuWidth = contextMenu.clientWidth
    const contextMenuHeight = contextMenu.clientHeight
    if (contextMenuHeight + this.posY >= window.innerHeight) {
      this.posY -= contextMenuHeight
    }
    if (contextMenuWidth + this.posX >= window.innerWidth) {
      this.posX -= contextMenuWidth
    }
    this.posStyle = {
      left: this.posX + 'px',
      top: this.posY + 'px'
    }
  }

  // 操作menu弹出框
  handlerMenu(val): void {
    this.clickMenuVisible = val
  }

  // 判断是否为叶节点
  isLeaf(data): boolean {
    let flag = false
    this.leafConfig.forEach((item: TreeModel) => {
      for (const key in item) {
        if (data[key] === item[key]) {
          flag = true
        }
      }
    })
    return flag
  }

  // 过滤节点
  filterNode(value, data): boolean {
    // if (!value) return
    const filterElm = this.$refs[this.treeId] as TreeModel
    if (this.filter.flag === true) {
      return filterElm.getCheckedNodes().findIndex(_ => _[this.treeProps.label] === data[this.treeProps.label]) >= 0 && data[this.treeProps.label].indexOf(value) !== -1
    }
    if (this.filter.flag === false) {
      return filterElm.getCheckedNodes().findIndex(_ => _[this.treeProps.label] === data[this.treeProps.label]) < 0 && data[this.treeProps.label].indexOf(value) !== -1
    }
    return data[this.treeProps.label].indexOf(value) !== -1
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
.directory-tree-wrapper {
  // height: 100%;
  // overflow: auto;
  font-size: 14px;
  /deep/ .el-checkbox:last-of-type {
    margin-right: 8px;
  }
}
.menu-wrapper {
  position: fixed;
  z-index: 1000;
  .rightClickMenuWrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-width: 200px;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 3px 6px 0 rgba(72, 72, 72, 0.35);
    border-radius: 6px;
    z-index: 100;
    .contextMenuHead {
      width: 100%;
      height: 74px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #2891ff;
      .contextMenuHeadImg {
        width: 56px;
        height: 56px;
        line-height: 56px;
        text-align: center;
        border-radius: 50%;
        border: 1px solid #2891ff;
        i {
          font-size: 30px;
        }
      }
    }
    .contextMenuItem {
      box-sizing: border-box;
      width: 230px;
      height: 40px;
      line-height: 40px;
      padding: 0 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      cursor: pointer;
      .contextMenuText {
        margin-left: 6px;
      }
    }
    .contextMenuItem:hover {
      background-color: #2891ff;
      color: #fff;
    }
  }
}
</style>
