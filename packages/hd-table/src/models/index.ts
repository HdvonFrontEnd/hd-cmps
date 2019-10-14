import { ElTable } from 'element-ui/types/table' // eslint-disable-line
export interface Column {
  type?: string;
  prop?: string;
  label?: string;
  [propName: string]: any;
}

export interface MyElTable extends ElTable {
  bodyWrapper: any;
}
