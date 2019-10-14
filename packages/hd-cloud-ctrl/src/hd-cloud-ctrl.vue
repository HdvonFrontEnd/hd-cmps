<template>
  <div class="hd-cloud-ctrl-wrapper">
    <div class="hd-cloud-inner"></div>
    <div class="home" :style="{cursor: this.homeIcon ? 'pointer' : 'inherit'}" @click="onHomeClick">
      <i :class="homeIcon"></i>
    </div>
    <span
      :class="['button', `cloud-arrow--${item}`]"
      v-for="item in arrowArr"
      :key="item"
      @mousedown="onArrowMouseDown(item)"
      @mouseup="onArrowMouseUp(item)"
    >
      <i :class="arrowIcon"></i>
    </span>
  </div>
</template>

<script lang="ts">
/**
 * 云台控制组件
 * Created by weibin on 2019-04-19
 */
import { HdCmpsComponent } from 'types/component'
import { Component, Prop } from 'vue-property-decorator'

const arrowBaseArr = ['up', 'right', 'down', 'left']
const arrowExtraArr = ['upRight', 'downRight', 'downLeft', 'upLeft']
@Component
export default class HdCloudCtrl extends HdCmpsComponent {
  @Prop({ type: Number, default: 8 }) readonly arrowNum!: number
  @Prop({ type: String, default: 'el-icon-arrow-down' }) readonly arrowIcon!: string
  @Prop(String) readonly homeIcon: string | undefined

  arrowArr = this.arrowNum === 8 ? [...arrowBaseArr, ...arrowExtraArr] : arrowBaseArr

  // 箭头

  /**
   * 点击复位按钮
   * @param e
   */
  onHomeClick(e) {
    this.$emit('homeClick', e)
  }
  /**
   * 按下箭头按钮
   * @param arrow
   */
  onArrowMouseDown(arrow) {
    this.$emit('arrowMouseDown', arrow)
  }
  /**
   * 松开箭头按钮
   * @param arrow
   */
  onArrowMouseUp(arrow) {
    this.$emit('arrowMouseUp', arrow)
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
$innerSize: 96%;
$baseColor: #4cb8ff;
$arrowColor: #fff;
$homeColor: #fff;
$homeBgColor: #353535;
$arrowPos: 12%;
$homeSize: 25%;
.hd-cloud-ctrl-wrapper {
  position: relative;
  border-radius: 50%;
  background-color: $baseColor;
  font-size: 22px;
  .hd-cloud-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    width: $innerSize;
    height: $innerSize;
    border-radius: 50%;
    background-color: darken($baseColor, 10);
  }
  .home {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: $homeSize;
    height: $homeSize;
    border-radius: 50%;
    color: $homeColor;
    background-color: $homeBgColor;
    cursor: pointer;
  }
  .button {
    position: absolute;
    cursor: pointer;
    color: $arrowColor;
    width: 25%;
    height: 25%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    &:hover {
      color: lighten($baseColor, 10);
    }
  }
  .cloud-arrow--up {
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotateZ(180deg);
  }
  .cloud-arrow--upRight {
    top: $arrowPos;
    right: $arrowPos;
    transform: rotateZ(-135deg);
  }
  .cloud-arrow--right {
    top: 50%;
    right: 0;
    transform: translateY(-50%) rotateZ(-90deg);
  }
  .cloud-arrow--downRight {
    bottom: $arrowPos;
    right: $arrowPos;
    transform: rotateZ(-45deg);
  }
  .cloud-arrow--down {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .cloud-arrow--downLeft {
    bottom: $arrowPos;
    left: $arrowPos;
    transform: rotateZ(45deg);
  }
  .cloud-arrow--left {
    top: 50%;
    left: 0;
    transform: translateY(-50%) rotateZ(90deg);
  }
  .cloud-arrow--upLeft {
    top: $arrowPos;
    left: $arrowPos;
    transform: rotateZ(135deg);
  }
}
</style>
