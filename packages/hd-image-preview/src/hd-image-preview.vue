<template>
	<div class="hd-image-preview-wrapper">
    <!--小图-->
    <img class="hd-img-thumbnail" :src="thumbnailSrc" @click="summon" ref="thumbnail">
    <!-- PhotoSwipe 用 -->
    <div ref="previewContainer" class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

      <!-- Background of PhotoSwipe.
           It's a separate element as animating opacity is faster than rgba(). -->
      <div class="pswp__bg"></div>

      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">

        <!-- Container that holds slides.
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
          <div class="pswp__item"></div>
        </div>

        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">

          <div class="pswp__top-bar">

            <!--  Controls are self-explanatory. Order can be changed. -->

            <div class="pswp__counter"></div>

            <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

            <button class="pswp__button pswp__button--share" title="Share"></button>

            <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

            <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

            <!-- Preloader demo https://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>

          <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </button>

          <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </button>

          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script lang="ts">
import * as PhotoSwipe from 'photoswipe'
import * as PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'
import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import { HdCmpsComponent } from 'types/component'
import { Component, Prop, Ref } from 'vue-property-decorator'

@Component({ name: 'hd-image-preview' })

export default class HdImagePreview extends HdCmpsComponent {
    /**
     * 当前图片在图片列表中的索引
     * 如果配置不正确，则大图与小图会对不上
     */
    @Prop({ type: Number, default: 0 }) imageIndex: number
    /**
     * 图片列表
     * 放大之后，可以在图片列表内切换图片
     */
    @Prop({ type: Array, default: () => [] }) imageList: Array<PhotoSwipe.Item>

    @Ref() readonly previewContainer!: HTMLElement
    @Ref() readonly thumbnail!: HTMLElement

    get thumbnailSrc(): string {
      // 如果没有设置msrc则取src
      return this.imageList[this.imageIndex] && (this.imageList[this.imageIndex].msrc || this.imageList[this.imageIndex].src)
    }

    get localImageList(): Array<PhotoSwipe.Item> {
      return this.imageList.map(image => {
        // 如果没有提供图片宽高，则取缩略图的宽高
        if (!image.w || !image.h) {
          const rect = this.thumbnail.getBoundingClientRect()
          return Object.assign(image, {
            w: rect.width,
            h: rect.height
          })
        } else {
          return image
        }
      })
    }

    summon(): void{
      const options = {
        index: this.imageIndex,
        // 配置动画
        getThumbBoundsFn: () => {
          // See Options->getThumbBoundsFn section of docs for more info
          const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          const rect = this.thumbnail.getBoundingClientRect()

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
        }
      }
      const gallery = new PhotoSwipe(this.previewContainer, PhotoSwipeUI_Default, this.localImageList, options)
      gallery.init()
    }
}

</script>

<style ref="stylesheet/scss" lang="scss" scoped>
	.hd-image-preview-wrapper {
    .hd-img-thumbnail {
      width: 100%;
      cursor: pointer;
    }
	}
</style>
