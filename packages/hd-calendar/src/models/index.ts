export interface CalendarOptions {
  [propName: string]: any;
}

export interface CalendarApi extends Element {
  getDate(): CalendarOptions;
  getApi(): CalendarOptions;
  [propName: string]: any;
}
