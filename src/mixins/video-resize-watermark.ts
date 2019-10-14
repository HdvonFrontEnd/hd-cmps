/**
 * 水印大小自适应
 * 监听播放窗口变化，应付网页全屏、全屏等情况
 * created by weibin on 2019-04-15
 * updated by weibin on 2019-09-17
 */
import { HdCmpsComponent } from 'types/component'
import { HdVideoPlugin, Watermark } from 'types/hd-video-type'
import { Component } from 'vue-property-decorator'
import * as CssElementQueries from 'css-element-queries'

@Component
export default class VideoResizeWatermark extends HdCmpsComponent {
  /**
   * 初始化水印大小自适应
   * @param videoContainer
   * @param watermarkMsgObj
   * @param plugin
   */
  $_initResizeWatermark(videoContainer: Element, watermarkMsgObj: Watermark, plugin: HdVideoPlugin): void {
    new CssElementQueries.ResizeSensor(videoContainer, (): void => {
      console.log(videoContainer.clientHeight, '<=======video container size change to')
      this.$_updateWatermarkSize(videoContainer, watermarkMsgObj, plugin)
    })
  }
  /**
   * 更新水印大小
   */
  $_updateWatermarkSize(container: Element, watermarkMsgObj: Watermark, plugin: HdVideoPlugin): void {
    // 如果之前获取过水印
    const fontsize: number = this.$_getWatermarkSize(container)
    console.log('水印大小变成：', fontsize)
    // 清空水印，通过将水印的上下左右设为0
    plugin.HDPlayer_SetOSDText(0, 0, 0, 0, 0, '', fontsize, 0, 255, 255, 255, 255)
    // 重新写水印
    plugin.HDPlayer_SetOSDText(0, 0, 100, 100, 0, `${watermarkMsgObj.name} \r\n${watermarkMsgObj.cardId}\r\n${watermarkMsgObj.systemName}`, fontsize, 0, 255, 255, 255, 255)
  }
  /**
   * 获取水印大小
   * @returns {number}
   */
  $_getWatermarkSize(container: Element): number {
    const baseRatio = 14 / 628 // 默认大小除以默认宽度（4分屏时）
    return Math.floor(baseRatio * container.clientWidth)
  }
}
