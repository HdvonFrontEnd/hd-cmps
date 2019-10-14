import { ProtocolInterface } from '../../types/hd-video-type'

// 播放网络协议
const PROTOCOL: ProtocolInterface = {
  TCP: 1,
  UDP: 0
}

// 错误码
const ERROR_CODE = {
  '-1': '接收码流超时',
  '-2': 'TCP连接断开',
  '-3': '下载超时',
  '-4': 'UDP端口被占用',
  '-5': 'TCP连接失败',
  '-6': '解码失败',
  '-7': '取流失败'
}

// 消息码
const MESSAGE_CODE = {
  '1': '开始视频播放',
  '2': '停止视频播放',
  '3': '开始视频下载',
  '4': '停止视频下载',
  '5': '收到码流',
  '6': '收到关键帧',
  '7': '码流是国标格式',
  '8': '码流含有音频',
  '9': '更新码率信息',
  '10': '更新丢包率信息'
}

export {
  PROTOCOL,
  ERROR_CODE,
  MESSAGE_CODE
}
