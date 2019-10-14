<template>
  <el-select
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
  >
    <el-option
      v-for="option in $attrs.options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    ></el-option>
  </el-select>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseSelect extends Vue {
  @Prop() readonly value!: boolean | string | number | boolean[] | string[] | number[]
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
</style>
