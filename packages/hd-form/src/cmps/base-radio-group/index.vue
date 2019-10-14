<template>
  <el-radio-group
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
  >
    <el-radio
      v-for="option in $attrs.options"
      :key="option.value"
      :label="option.value"
    >{{option.label}}</el-radio>
  </el-radio-group>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseRadioGroup extends Vue {
  @Prop() readonly value!: string | number
}
</script>
