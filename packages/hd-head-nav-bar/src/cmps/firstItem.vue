<template>
  <div>
    <span style="color: red" v-if="authMenu && !authMenu[item.name]">X</span>
    <i :class="['iconfont', item.meta.icon]" v-if="item.meta && item.meta.icon"></i>
    {{this.authMenu && this.authMenu[this.item.name]?this.authMenu[this.item.name].name || this.item.meta.title:this.item.meta.title}}
    <i
      class="el-icon-arrow-down"
      v-if="item.children && item.children.length!=0"
    ></i>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'FirstItem'
})
export default class FirstItem extends Vue {
  @Prop(Object) item: {}
  @Prop(Object) authMenu: {}
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped></style>
