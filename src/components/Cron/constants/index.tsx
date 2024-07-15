export enum UnitEnum {
  Second = "second",
  Minute = "minute",
  Hour = "hour",
  Day = "day",
  Week = "week",
  Month = "month",
  Year = "year",
}
export const unitIndex = {
  [UnitEnum.Second]: 0,
  [UnitEnum.Minute]: 1,
  [UnitEnum.Hour]: 2,
  [UnitEnum.Day]: 3,
  [UnitEnum.Month]: 4,
  [UnitEnum.Week]: 5,
  [UnitEnum.Year]: 6,
};

export const unitLabels = {
  [UnitEnum.Second]: "秒",
  [UnitEnum.Minute]: "分",
  [UnitEnum.Hour]: "时",
  [UnitEnum.Day]: "日",
  [UnitEnum.Week]: "周",
  [UnitEnum.Month]: "月",
  [UnitEnum.Year]: "年",
};

export type BriefMonth =
  | "JAN"
  | "FEB"
  | "MAR"
  | "APR"
  | "MAY"
  | "JUN"
  | "JUL"
  | "AUG"
  | "SEP"
  | "OCT"
  | "NOV"
  | "DEC";

export const BriefMonthMap = {
  JAN: 1,
  FEB: 2,
  MAR: 3,
  APR: 4,
  MAY: 5,
  JUN: 6,
  JUL: 7,
  AUG: 8,
  SEP: 9,
  OCT: 10,
  NOV: 11,
  DEC: 12,
};

export type BriefWeek = "SUN" | "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT";
export const BriefWeekMap = {
  SUN: 1,
  MON: 2,
  TUE: 3,
  WED: 4,
  THU: 5,
  FRI: 6,
  SAT: 7,
};

export const weekOptions_Zero = [
  {
    label: "日",
    value: 0,
  },
  {
    label: "一",
    value: 1,
  },
  {
    label: "二",
    value: 2,
  },
  {
    label: "三",
    value: 3,
  },
  {
    label: "四",
    value: 4,
  },
  {
    label: "五",
    value: 5,
  },
  {
    label: "六",
    value: 6,
  },
];
export const weekOptions_One = [
  {
    label: "日",
    value: 1,
  },
  {
    label: "一",
    value: 2,
  },
  {
    label: "二",
    value: 3,
  },
  {
    label: "三",
    value: 4,
  },
  {
    label: "四",
    value: 5,
  },
  {
    label: "五",
    value: 6,
  },
  {
    label: "六",
    value: 7,
  },
];

export const UnitRange = {
  [UnitEnum.Second]: {
    min: 0,
    max: 59,
  },
  [UnitEnum.Minute]: {
    min: 0,
    max: 59,
  },
  [UnitEnum.Hour]: {
    min: 0,
    max: 23,
  },
  [UnitEnum.Day]: {
    min: 1,
    max: 31,
  },
  [UnitEnum.Month]: {
    min: 1,
    max: 12,
  },
  [UnitEnum.Week]: {
    min: 0,
    max: 7,
  },
  [UnitEnum.Year]: {
    min: 1970,
    max: 2099,
  },
};
