## ImagePreview 图片预览

基于[PhotoSwipe](https://github.com/dimsemenov/PhotoSwipe)实现

#### 功能实现
- 封装photoswipe配置，只需要传入图片列表即可使用
- 封装动画，开启关闭图片时会有一个放大缩小的效果
- 取消了photoswipe中图片需预先设定尺寸的要求，如果没有设定会使用缩略图的显示尺寸
- 渐进性图片加载效果

### 基本用法
:::demo 通过imageList传入图片信息，缩略图的大小通过css设置。
```html
<template>
  <hd-image-preview
   :image-list="imageSingle"
   style="width: 128px; height: 72px"
   ></hd-image-preview>
</template>
<script>
export default {
  data() {
    return {
      imageSingle: [
        {
          src: 'https://placekitten.com/1280/720',
          w: 1280,
          h: 720,
          title: '基本用法-猫咪'
        }
      ]
    }
  }
}
</script>
```
:::

### 多张图片组成一组
imageList数组中可以放入多项，数组内的图片会组成一组。放大后可以相互切换。
:::demo 注意，需要同时设置好imageIndex，当前图片在图片列表中的索引。如果配置不正确，大图与小图会对不上。
```html
<template>
  <div style="display: flex;">
    <hd-image-preview 
      style="width: 128px; height: 72px; margin-right: 20px;"
      :image-list="imageList" 
      v-for="(image, index) in imageList" 
      :key="index" 
      :image-index="index">
    </hd-image-preview>
  </div>
</template>

<script>
export default {
  data() {
    return {
      imageList: [
        {
          src: 'https://placekitten.com/1280/720',
          w: 1280,
          h: 720,
          title: '猫咪2'
        },
        {
          src: 'https://placekitten.com/1920/1080',
          w: 1920,
          h: 1080,
          title: '猫咪1'
        }
      ]
    }
  }
}
</script>
```
:::

### 渐进式加载

通过提供小图链接（msrc）可以实现渐进式加载
::: demo
```html
<template>
  <hd-image-preview
   :image-list="image"
   style="width: 128px; height: 72px"
   ></hd-image-preview>
</template>

<script>
export default {
  data() {
    return {
      image: [
        {
          msrc: 'https://farm4.staticflickr.com/3902/14985871946_86abb8c56f_m.jpg',
          src: 'https://farm4.staticflickr.com/3902/14985871946_24f47d4b53_h.jpg',
          w: 1509,
          h: 849,
          title: '渐进式加载'
        }
      ]
    }
  }
}
</script>
```
:::

### Attributes
|      参数     |    说明   |   类型  | 可选值 | 默认值 |
|---------------|---------|---------|--------|--------|
| imageIndex | 当前图片在图片列表中的索引。如果配置不正确，则大图与小图会对不上 | number | — | 0 |
| imageList | 图片列表，对象数组，包含一系列配置。见下表。 | array | — | — |

### imageList
配置 | 说明 | 类型 | 是否必填
--- | --- | --- | ---
src | 图片地址（大）| string | 是
msrc | 图片地址（小），用于渐进式加载| string | 否
title | 图片文字说明| string | 否
w | 大图的宽度（px） | number | 否
h | 大图的高度（px）| number | 否