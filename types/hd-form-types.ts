// 表单的v-model值的结构
export interface FormModelType {
  [key: string]: any;
}

// 表单配置项结构
export interface FormConfigItem {
  label?: string;
  type?: FormItemType;
  key?: string;
  formItemProps?: FormProps;
  props?: FormProps;
  required?: boolean;
  listeners?: object;
  ifRender?: ifRenderFunction;
  $_ifRender?: boolean;
  getProps?: getPropsFunction;
  component?: string;
}

export interface DefaultFormConfigItem extends FormConfigItem{
  component: string;
  props: FormProps;
}

export interface FormProps {
  [prop: string]: any
}

// 支持的表单项类型
export type FormItemType = 'select'
  | 'rate'
  | 'text'
  | 'switch'
  | 'radio-group'
  | 'radio-group'
  | 'number'
  | 'slider'
  | 'time-picker'
  | 'date-picker'
  | 'upload'
  | 'slot'
  | 'title'

// 动态渲染函数
export interface ifRenderFunction {
  (model?: FormModelType): boolean;
}

// 表单项props动态配置函数
export interface getPropsFunction {
  (model?: FormModelType): object;
}

//
