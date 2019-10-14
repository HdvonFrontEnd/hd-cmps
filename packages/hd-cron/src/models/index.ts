export interface CornGenModel extends Element {
  generate(): string;
}

export interface CornParams {
  [propName: string]: any;
  cronLastSpecificDomDay?: number;
}
