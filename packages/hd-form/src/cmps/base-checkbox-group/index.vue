<template>
  <el-checkbox-group
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
  >
    <el-checkbox
      v-for="option in $attrs.options"
      :key="option.value"
      :label="option.value"
      :disabled="option.disabled"
    >{{option.label}}</el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseCheckboxGroup extends Vue {
  @Prop({ default: () => [] }) readonly value!: (string | number)[]
}
</script>

