import {
  BriefMonth,
  BriefMonthMap,
  BriefWeek,
  BriefWeekMap,
  UnitEnum,
  unitIndex,
} from "../constants";
import { CronExpress } from "./cronParser";

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

/**
 * 验证是否是有效的cron表达式，只从正则语法上验证，不验证是否是合法的时间
 * @param cronExpress
 * @returns
 */
export const validCronExpress = async (cronExpress: string) => {
  const cronExp = new CronExpress(cronExpress);
  if (cronExp.validate()) {
    return Promise.resolve(true);
  } else {
    return Promise.resolve(false);
  }
};
