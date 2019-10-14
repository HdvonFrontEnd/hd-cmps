// 公用实体扩展属性
export interface TreeModel {
  [propName: string]: any;
}

// 输入筛选过滤实体
export interface FilterModel extends TreeModel {
  text: string;
  flag?: boolean;
}

// 子节点属性实体
export interface NodeChild extends TreeModel {
  nodeColor?: string;
  nodeIcon?: string;
}
