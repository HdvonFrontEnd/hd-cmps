/**
 * 录像下载相关WebSocket API
 */
export default class VideoDownloadApi<T> {
  private readonly _sendMethod
  constructor(sendMethod: <K>(...args) => Promise<K>) {
    this._sendMethod = sendMethod
  }
  /**
   * 下载控制
   * @param obj
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   protocol:协议，比如gb28181，rtsp，rtmp等
   *   transport:UDP, TCP-Active或TCP-Passive
   *   host:IP地址
   *   port：端口
   *   encode：转动需要用到(现在可不传)
   *   uri：录像uri地址
   *   startTime：开始时间 时间格式：2018-10-18T11:36:59
   *   endTime：开始时间 时间格式：2018-10-18T11:36:59
   * }
   * @returns {promise}
   */
  recordDownLoad(params): Promise<T> {
    const body = {
      type: 'recVideoDownload',
      method: 'download',
      param: {
        protocol: '28181',
        ...params
      }
    }
    return this._sendMethod(body)
  }
  /**
   * 下载列表查询
   * @param obj
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   startTime: 开始时间，如2018-10-11 01:05:15
   *   endTime: 结束时间，如2018-10-11 01:35:15
   * }
   * @returns {promise}
   */
  queryDownloadRecord(params): Promise<T> {
    const body = {
      type: 'recVideo',
      method: 'queryRecord',
      param: params
    }
    return this._sendMethod(body)
  }
}
