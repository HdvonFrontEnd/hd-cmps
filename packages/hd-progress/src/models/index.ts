export interface ProgressConfig {
  [propName: string]: any;
}

export interface TimeLine extends ProgressConfig {
  time: number;
  x: number;
  y: number;
}

export interface BlockItem extends ProgressConfig {
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface PlayItem extends ProgressConfig {
  startTimestamp: number;
  endTimestamp: number;
}

export interface HTMLCanvasExpand extends HTMLCanvasElement {
  setCapture(): void;
  releaseCapture(): void;
}
