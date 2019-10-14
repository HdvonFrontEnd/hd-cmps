/**
 * 录像回放相关WebSocket API
 */
export default class VideoReplayApi<T> {
  private readonly _sendMethod
  constructor(sendMethod: <K>(...args) => Promise<K>) {
    this._sendMethod = sendMethod
  }
  /**
   *  录像播放
   * @param params
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   protocol: 协议，比如gb28181，rtsp，rtmp等
   *   transport: UDP, TCP-Active或TCP-Passive
   *   host: 接收地址
   *   port: 接收端口
   *   uri: 录像uri地址
   *   startTime: 开始时间 时间格式：2018-10-18T11:36:59
   *   endTime: 结束时间 时间格式：2018-10-18T11:36:59
   * }
   * @returns {promise}
   */
  videoPlayback(params): Promise<T> {
    const body = {
      type: 'recVideo',
      method: 'playback',
      param: {
        protocol: '28181',
        ...params
      }
    }
    return this._sendMethod(body)
  }
  /**
   * 录像停止播放
   * @param params
   * {
   *    callId 点播返回的callIds
   *    deviceID 点播返回的deviceID
   * }
   * @returns {promise}
   */
  videoPlaybackStop(params): Promise<T> {
    const body = {
      type: 'recVideo',
      method: 'terminate',
      param: params
    }
    return this._sendMethod(body)
  }
  /**
   * 录像列表查询
   * @param obj
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   startTime: 开始时间，如2018-10-11 01:05:15
   *   endTime: 结束时间，如2018-10-11 01:35:15
   * }
   * @returns {promise}
   */
  queryReplayRecord(params): Promise<T> {
    const body = {
      type: 'recVideo',
      method: 'queryRecord',
      param: params
    }
    return this._sendMethod(body)
  }
  /**
   * 回看控制
   * @param obj
   * {
   *   callId: 会话id
   *   type: 回看控制类型1表示播放2表示随机播放3表示暂停4表示快进和慢进5表示停止
   *   scale: 播放速度
   *   range: 播放录像起点的相对值，取值范围为0到播放录像的终点时间，参数以s为单位，不能为负值。
   * }
   * @returns {promise}
   */
  playbackControl(params): Promise<T> {
    const body = {
      type: 'recVideo',
      method: 'playbackControl',
      param: params
    }
    return this._sendMethod(body)
  }
}
