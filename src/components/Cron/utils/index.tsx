import {
  BriefMonth,
  BriefMonthMap,
  BriefWeek,
  BriefWeekMap,
  UnitEnum,
  unitIndex,
} from "../constants";
import parser from "cron-parser";

// 判断是否是月份字符串
export const isMonthStr = (str: string) => {
  const monthStr = Object.keys(BriefMonthMap);
  return monthStr.includes(str);
};

export const getMonthNum = (monthStr: BriefMonth) => {
  return BriefMonthMap[monthStr];
};

// 判断是否是星期字符串
export const isWeekStr = (str: string) => {
  const weekStr = Object.keys(BriefWeekMap);
  return weekStr.includes(str);
};

export const getWeekNum = (weekStr: BriefWeek) => {
  return BriefWeekMap[weekStr];
};

export const getUnitIndex = (unit: UnitEnum) => {
  return unitIndex[unit];
};

// 校验是否是有效的cron表达式

export const validCronExpress = async (cronExpress: string) => {
  try {
    parser.parseExpression(cronExpress);
    return true;
  } catch (e: any) {
    return false;
  }
};
