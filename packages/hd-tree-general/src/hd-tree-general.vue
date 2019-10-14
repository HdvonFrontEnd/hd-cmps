<template>
  <div class="hd-tree-general">
    <el-input
      v-if="filterable"
      size="mini"
      suffix-icon="el-icon-search"
      v-model="myFilter.text">
    </el-input>
    <hd-tree
      :style="innerStyle"
      :root-tree="rootTree"
      :filter="filterable ? myFilter : filter"
      :tag-config="tagConfig"
      @getTreeRef="getRef"
    >
      <el-tooltip
        slot="prepend"
        slot-scope="{ data }"
        v-if="data.prependSlot"
        :content="data.prependSlot.tooltipName"
        placement="top"
      >
        <i :class="data.prependSlot.iconName" :style="data.prependSlot.style" class="iconfont"></i>
      </el-tooltip>
    </hd-tree>
  </div>
</template>
<script>
import { genTreeData, without, union, isEmpty, unionBy, cloneDeep } from 'src/utils/utils'
import HdTree from 'packages/hd-tree'
export default {
  name: 'hd-tree-general',
  components: { HdTree },
  props: {
    value: {
      type: [Array, String], // 多选为数组，单选为字符串
      default: () => []
    },
    type: {
      type: String,
      default: 'checkbox' // checkbox，select，radio
    },
    treeData: {
      type: Array,
      default: () => []
    },
    tagConfig: {
      type: Object,
      default: () => ({})
    },
    innerStyle: {
      type: Object,
      default: () => ({})
    },
    filterNodeMethod: Function,
    checkStrictly: Boolean,
    elCheckStrictly: Boolean, // 这个才是真正的checkStrictly
    treeStructure: { // 是否需要树结构计算
      type: Boolean,
      default: true
    },
    filterable: { // 是否需要搜索框
      type: Boolean,
      default: true
    },
    filter: { // 搜索条件
      type: Object,
      default: () => ({
        text: null, // 相关文本
        flag: null // 是否为选中
      })
    }
  },
  model: {
    props: 'value',
    event: 'selected'
  },
  data() {
    return {
      myFilter: {
        text: null
      },
      tempValue: [],
      treeRef: null,
      // 单选时，使用
      radio: {
        model: this.value,
        label: 'name',
        value: 'id',
        change: this.onRadioChange
      }
    }
  },
  computed: {
    myType() {
      if (this.type === 'radio') {
        return {
          type: 'radio',
          radio: this.radio
        }
      }
      return { type: this.type }
    },
    rootTree() {
      return {
        ...this.myType,
        attrs: {
          data: this.getTreeData(),
          'check-strictly': this.elCheckStrictly || this.checkStrictly,
          'highlight-current': this.type === 'select'
        },
        listeners: {
          'check-change': this.onCheckChagne,
          'node-click': this.onNodeClick
        },
        defaultProps: {
          label: 'name',
          children: 'children'
        }
      }
    }
  },
  methods: {
    getRef(treeRef) {
      this.treeRef = treeRef
    },
    // 获取数据的树结构
    getTreeData() {
      const treeData = cloneDeep(this.treeData)
      let data = treeData
      // 过滤数据
      if (this.filterNodeMethod) {
        data = data.filter(v => this.filterNodeMethod(null, v))
        if (this.treeStructure) {
          data = union(data, this.getParents(data, treeData))
        }
      }
      return this.treeStructure ? genTreeData(data, '0', 1) : unionBy(data, 'id')
    },
    // 通过子叶子节点，递归找出父节点
    getParents(data, treeData) {
      let result = []
      getParentNodes(data, treeData)
      function getParentNodes(data, treeData) {
        const arr = []
        data.forEach(child => {
          const parent = treeData.find(node => node.id === child.parentId)
          if (parent) {
            arr.push(parent)
          }
        })
        if (arr.length) {
          result = union(result, arr)
          getParentNodes(arr, treeData)
        }
      }
      return result
    },
    onRadioChange(key) {
      const data = this.treeData.find(v => v.id === key)
      this.$emit('selected', key, data)
    },
    onCheckChagne(data, checked, indeterminate) {
      // 补丁: 修复，在select模式，选中子后，选父，该子不会被选中
      const parentNode = this.treeRef.getNode(data.parentId)
      if (this.type === 'select' && parentNode && parentNode.checked) {
        checked = true
      }
      // 缓存起所有的change
      this.tempValue.push({ data, checked, indeterminate })
      // 等待所有checkChange触发完后，再$emit更新数据
      setTimeout(() => {
        // 如果tempValue为空， 则无需更新
        if (isEmpty(this.tempValue)) return
        let keys = this.value.slice()
        this.tempValue.forEach(({ data, checked, indeterminate }) => {
          if (checked) {
            keys = union(keys, [data.id])
            // 有关联才加上子节点
            if (!this.elCheckStrictly) { keys.push(...this.getChildren(data)) }
          } else {
            // 当父节点为半选状态时，无需清除子节点的选中状态
            keys = indeterminate ? without(keys, data.id) : without(keys, data.id, ...this.getChildren(data))
          }
        })

        this.emitSelected(keys)
        this.tempValue = []
      }, 100)
    },
    emitSelected(keys) {
      const data = this.treeData.filter(v => keys.includes(v.id))
      this.$emit('selected', keys, data)
    },
    onNodeClick(data, node) {
      if (this.type === 'select' && !node.disabled) {
        // 先清空原有选择, 为了解决多次点击有选中缓存的问题
        this.value.splice(0, this.value.length)
        this.treeRef.setCheckedKeys([])
        // 再设置选中
        node.checked = true
      }
    },
    // 为了解决，没展开时，选择父节点，子节点不触发change的问题
    getChildren(data) {
      let arr = []
      if (data.children) {
        arr = union(arr, data.children.map(v => v.id))
        data.children.forEach(v => {
          if (v.children) {
            arr = union(arr, this.getChildren(v))
          }
        })
      }
      return arr
    },
    // 更新选中状态
    updateCheckedKeys() {
      if (this.treeRef) {
        if (isEmpty(this.value)) {
          this.treeRef.setCheckedKeys([])
        } else {
          if (!this.elCheckStrictly) {
            this.treeRef.setCheckedKeys(this.value, this.checkStrictly) // 如果为true则选中子节点
          }
        }
      }
    }
  },
  mounted() {
    // 因为第一次watch时，还没有ref，需要在mounted的时候初始化选中值
    if (this.type === 'checkbox') {
      this.updateCheckedKeys()
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.type === 'checkbox') {
          this.updateCheckedKeys()
        }
        if (this.type === 'radio') {
          this.radio.model = val
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
