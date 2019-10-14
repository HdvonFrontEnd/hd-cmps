/**
 * 云台控制相关WebSocket API
 */
interface CloudControlRequest {
  deviceID: string;
  type: 'direction' | 'zoom' | 'iris' | 'focus';
  direction?: string;
  zoom?: 0 | 1 | 2;
  iris?: 0 | 1 | 2;
  focus?: 0 | 1 | 2;
  speed: number;
}

export default class ControlApi<T> {
  private readonly _sendMethod
  constructor(sendMethod: <K>(...args) => Promise<K>) {
    this._sendMethod = sendMethod
  }
  /**
   * 云台控制
   * @param params
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   type: 云台控制类型，'direction'控制方向'zoom'控制镜头变倍'iris'控制光圈'focus'控制焦距
   *   speed: 速度
   *   direction: 控制方向类型（详见接口文档）
   *   zoom：控制镜头类型（详见接口文档）
   *   iris：控制光圈类型（详见接口文档）
   *   focus：控制焦距类型（详见接口文档）
   * }
   * @returns {promise}
   */
  cloudControl(params: CloudControlRequest): Promise<T> {
    // 用于补充参数
    // 因为一次控制中，direction、zoom、iris、focus只能有一个参数有效，其他参数都填写0
    const padParams = {}
    const toBePad = ['direction', 'zoom', 'iris', 'focus'].filter(item => item !== params.type)
    toBePad.forEach(item => {
      padParams[item] = 0
    })
    const body = {
      type: 'common',
      method: 'PTZ',
      param: Object.assign(params, padParams)

    }
    return this._sendMethod(body)
  }
  /**
   * 巡航预案控制
   * @param params
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   type: 巡航控制类型'1'表示加入巡航点'2'表示删除一个巡航点'3'设置巡航速度4'设置巡航停留时间'5'开始巡航'0'停止巡航
   *   groupNum: 巡航组号 取值范围：0-255
   *   presetNum: 预置位号 1-255 （0为预留， 当cmdType = 2,删除操作时，此时才能填写0，表示删除整组预置位）
   *   stayTime：巡航停留时间 单位：s
   *   speed：巡航速度
   * }
   * @returns {promise}
   */
  cruiseControl(params): Promise<T> {
    const body = {
      type: 'common',
      method: 'cruise',
      param: params
    }
    return this._sendMethod(body)
  }
  /**
   * 预置位控制
   * @param params
   * {
   *   deviceID: 摄像机设备id（摄像机编码）
   *   type: 预置位控制类型1表示设置2表示调用3表示删除
   *   presetNum: 预置位编号 范围1-255
   * }
   * @returns {promise}
   */
  presetControl(params): Promise<T> {
    const body = {
      type: 'common',
      method: 'preset',
      param: params
    }
    return this._sendMethod(body)
  }

  /**
   * 预置位查询
   * @param deviceID：摄像机设备id（摄像机编码）
   * @returns {promise}
   */
  queryPreset(deviceID): Promise<T> {
    const body = {
      type: 'common',
      method: 'queryPreset',
      param: { deviceID }
    }
    return this._sendMethod(body)
  }
  /**
   * 3D放大或缩小
   * @params params
   * {
   *   deviceID：摄像机设备id（摄像机编码）
   *   type：类型 amplify 放大 narrow 缩小
   *   length：播放窗口长度像素值
   *   width：播放窗口宽度像素值
   *   midPointX：拉框中心的横轴坐标像素值
   *   midPointY：拉框中心的纵轴坐标像素值
   *   lengthX：拉框长度像素值
   *   lengthX：拉框宽度像素值
   * }
   * @returns {promise}
   */
  dragZoom(params): Promise<T> {
    const body = {
      type: 'common',
      method: 'dragZoom',
      param: params
    }
    return this._sendMethod(body)
  }
  /**
   * 看守位控制
   * @params params
   * {
   *   deviceID：摄像机设备id（摄像机编码）
   *   enabled：看守位使能1：开启，0：关闭
   *   resetTime：自动归位时间间隔
   *   presetNum：预置位编号，开启看守位时使用，取值范围0～255
   * }
   * @returns {promise}
   */
  homePosition(params): Promise<T> {
    const body = {
      type: 'common',
      method: 'homePosition',
      param: params
    }
    return this._sendMethod(body)
  }
}
