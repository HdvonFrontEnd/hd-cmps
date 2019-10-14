/**
 * 视频播放相关WebSocket API
 */
export default class VideoApi<T> {
  private readonly _sendMethod
  constructor(sendMethod: <K>(...args) => Promise<K>) {
    this._sendMethod = sendMethod
  }
  /**
   *  视频播放
   * @param params
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   port:  接收端口
   *   transport: UDP/TCP,
   *   host: 接收地址（选填）
   *   encode: 转动需要用到（选填）
   * }
   * @returns {promise}
   */
  videoPlayStart(params): Promise<T> {
    const body = {
      type: 'video',
      method: 'play',
      param: {
        protocol: '28181',
        ...params
      }
    }
    return this._sendMethod(body)
  }
  /**
   * 视频停止播放
   * @params params
   * {
   *   callId 点播返回的callIds
   *   deviceID 点播返回的diviceId
   * }
   * @returns {promise}
   */
  videoPlayStop(params): Promise<T> {
    const body = {
      type: 'video',
      method: 'terminate',
      param: { ...params }
    }
    return this._sendMethod(body)
  }
}
