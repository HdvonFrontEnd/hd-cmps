export interface HdRouter {
  [propName: string]: any;
}

export interface RouterItem extends HdRouter {
  hidden?: string;
}
