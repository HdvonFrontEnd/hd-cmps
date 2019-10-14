<template>
  <div class="reader-simple-wrapper" v-html="value"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({
  name: 'reader-simple'
})
export default class ReaderSimple extends Vue {
  @Prop({ type: String, default: '' }) value: string
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
  .reader-simple-wrapper {
    /*width: 100%;*/
    /*height: 100%;*/
  }
</style>
<style ref="stylesheet/scss" lang="scss">
  .reader-simple-wrapper {
    a,
    a:focus,
    a:hover {
      cursor: pointer;
      color: #0000EE;
      text-decoration: underline;
    }
    ul, ol {
      display: block;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      padding-inline-start: 40px;
    }
    ul {
      list-style-type: disc;
    }
    ol {
      list-style-type: decimal;
    }
    li {
      display: list-item;
      list-style: inherit;
    }
  }
</style>
