export interface Condition {
  [propName: string]: any;
}

export interface ConditionItem extends Condition {
  stand?: boolean;
  key?: string | number;
}

export interface ConditionFormItem extends Condition {
  optionList: string[];
}

export interface CheckedItem extends Condition {
  label: string;
  key: never;
}
