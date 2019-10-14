export interface Condition {
  [propName: string]: any;
}

export interface ConditionTreeAttrs extends Condition{
  type: string;
  treeData: Condition[];
}
