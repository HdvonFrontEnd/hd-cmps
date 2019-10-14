<template>
  <div @click="menuClick">
    <span style="color: red" v-if="authMenu && !authMenu[item.name]">X</span>
    <i :class="['iconfont', item.meta.icon]" v-if="item.meta && item.meta.icon"></i>
    {{this.authMenu && this.authMenu[this.item.name]?this.authMenu[this.item.name].name || this.item.meta.title:this.item.meta.title}}
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ThreeItem'
})
export default class ThreeItem extends Vue {
  @Prop(Object) item: {}
  @Prop(Object) authMenu: {}
  @Prop({ type: Function, default: () => {} }) menuClick: () => {}
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped></style>
