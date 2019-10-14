<template>
	<div class="hd-cron-wrapper">
    <el-input  v-bind="$attrs" placeholder="请输入cron表达式" v-model="cron" class="input-with-select">
      <el-button @click="dialogVisible = true" slot="append" icon="el-icon-date"></el-button>
    </el-input>
    <el-dialog
      title="执行周期选择"
      append-to-body
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :close-on-click-modal="closeOnClickModal"
      class="dialog">
      <!--简单版-->
      <!--<corn-gen-simple v-bind="$attrs" ref="cornGenerator"></corn-gen-simple>-->
      <!--复杂版-->
      <corn-gen-full v-bind="$attrs" ref="cornGenerator"></corn-gen-full>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Emit } from 'vue-property-decorator'
// import CornGenSimple from './cmps/cron-gen-simple.vue'
import CornGenFull from './cmps/cron-gen-full.vue'
import { CornGenModel } from './models/index' // eslint-disable-line

@Component({
  name: 'hd-cron',
  components: { CornGenFull }
})
export default class HdCron extends HdCmpsComponent {
  // ==================== Props ====================
  @Prop({ type: [String, Number] }) value: string | number
  @Prop({ type: Boolean, default: false }) closeOnClickModal: boolean

  // ==================== Data ====================
  dialogVisible = false

  // ==================== Emits ====================
  @Emit('input')
  onInputEmit(val) {
    return val
  }

  // ==================== Computeds ====================
  get cron(): number | string {
    return this.value
  }
  set cron(val) {
    this.onInputEmit(val)
  }

  // ==================== Methods ====================
  onConfirm(): void {
    this.cron = (this.$refs.cornGenerator as CornGenModel).generate()
    this.dialogVisible = false
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.hd-cron-wrapper {
	}
</style>
