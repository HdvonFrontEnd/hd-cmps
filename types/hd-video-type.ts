// 用数字代表布尔值，1为true，0为false
export type NumberBoolean = 0 | 1

// 网络协议，只能为tcp或udp
export type ProtocolType = 'TCP' | 'UDP' | 'tcp' | 'udp'

// 播放网络协议Map结构
export interface ProtocolInterface {
  [key: string]: NumberBoolean;
}

// 插件方法调用成功与否
export type PluginMethodSuccess = 0 | -1

// 当前限定水印需要符合这个结构，后续应该解耦
export interface Watermark {
  name: string;
  cardId: string;
  systemName: string;
}

// 视频播放插件
export interface HdVideoPlugin {
  HDPlayer_Init(): void;
  HDPlayer_OpenMediaPort(ip: string, port: number, isTcp: NumberBoolean): number;
  HDPlayer_LivePlay(ip: string, port: number, ssrc: number): PluginMethodSuccess;
  HDPlayer_LiveStop(): PluginMethodSuccess;
  HDPlayer_PicSnap(filePath: string, watermark: string, fontsize: number, alpha: number): PluginMethodSuccess;
  HDPlayer_RegionZoom(left: number, top: number, right: number, bottom: number): PluginMethodSuccess;
  HDPlayer_SetOSDText(left: number, top: number, right: number, bottom: number, align: 0 | 1 | 2, watermark: string, fontsize: number, rotate: number, alpha: number, r: number, g: number, b: number): PluginMethodSuccess;
  HDPlayer_StartCache(filePath: string): PluginMethodSuccess;
  HDPlayer_StopCache(): void;
  HDPlayer_LivePause(): void;
  HDPlayer_LiveResume(): void;
  HDPlayer_EnableDrawNotify(isEnable: NumberBoolean): void;
  HDPlayer_StartVideoDownload(ip: string, port: number, isTcp: 0 | 1, filePath: string, watermark: string, fontsize: number, x: number, y: number, alpha: number): PluginMethodSuccess;
  HDPlayer_StopVideoDownload(): PluginMethodSuccess;
}

// 视频播放插件支持的事件
export type HdVideoPluginEvents = 'on_notifyLivePlay'
  | 'on_notifyLiveStop'
  | 'on_notifyPicSnap'
  | 'on_notifyUrlPlay'
  | 'on_notifyUrlPlayStop'
  | 'on_notifyMouseLeftDown'
  | 'on_notifyMouseRightDown'
  | 'on_notifyMouseMoveIn'
  | 'on_notifyMouseDoubleClick'
  | 'on_notifyMouseScroll'
  | 'on_notifyBrowseFolder'
  | 'on_notifyStartVideoDownload'
  | 'on_notifyStopVideoDownload'
  | 'on_notifyDownloadParameter'
  | 'on_notifyKeyDown'
  | 'on_notifyPlayTime'
  | 'on_notifyMsg'
  | 'on_notifyDrawEnd'

// 请求视频流的返回
export interface JainSipResponse {
  result?: JainSipResponseBody;
}

// 请求视频流成功的返回body
export interface JainSipResponseBody {
  host: string;
  port: number;
  callId: string;
  recordList?: JainRecordListItem[];
}

// 录像列表项的结构
export interface JainRecordListItem {
  index: number;
  deviceId: string;
  startTime: string;
  endTime: string;
  uri: string;
  startTimestamp?: number; // 在接收到响应之后会计算出来并保存起来
  endTimestamp?: number;
}

// 云台控制方向
export type CloudDirection = 'left'
  | 'right'
  | 'up'
  | 'down'
  | 'upLeft'
  | 'upRight'
  | 'downLeft'
  | 'downRight'
  | 'stop'

// 焦距、光圈等设置方向
export type CameraAdjustType = 'zoom' | 'iris' | 'focus'

// 视频播放速率只能为以下值：
export type VideoSpeed = '0.25' | '0.5' | '1' | '2' | '4' | '8'

export type DownloadSpeed = 1 | 2 | 4 | 8

