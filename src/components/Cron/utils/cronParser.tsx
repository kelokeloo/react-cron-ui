import { isString } from "lodash";

export const everyRegex = /^\*$/; // 匹配全部
export const intervalRegex = /^(\d+)\/(\d+)$/; // 匹配间隔
export const specificRegexNumber = /^\d+$/; // 匹配单个数字的情况
export const specificRegexNumbers = /^(\d+,)*\d+$/; // 匹配“,”分隔的数字
export const rangeRegex = /^(\d+)-(\d+)$/; // 匹配区间格式
export const ignoreRegex = /^\?$/; // 匹配忽略
export const nearestWorkingDayRegex = /^(\d+)W$/; // 匹配最近的工作日
export const lastDayRegex = /^L$/; // 匹配最后一天
export const lastWorkingDayRegex = /^LW$/; // 匹配最后一个工作日
export const monthIntervalRegex =
  /^(\d+|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(\d+)$/;
export const monthSpecificRegexSingle =
  /^(\d+|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/;
export const monthSpecificRegexMultiple =
  /^(\d{1,2}|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,(\d{1,2}|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))$/;
export const monthRangeStrRegex =
  /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/;
export const weekIntervalRegex = /^(\d+|MON|TUE|WED|THU|FRI|SAT|SUN)\/(\d+)$/;
export const weekSpecificRegexSingle = /^(\d+|MON|TUE|WED|THU|FRI|SAT|SUN)$/;
export const weekSpecificRegexMultiple =
  /^(\d{1,2}|MON|TUE|WED|THU|FRI|SAT|SUN)(,(\d{1,2}|MON|TUE|WED|THU|FRI|SAT|SUN))$/;
export const weekRangeStrRegex =
  /^(MON|TUE|WED|THU|FRI|SAT|SUN)-(MON|TUE|WED|THU|FRI|SAT|SUN)$/;
export const weekMonthWeekLastDayRegex =
  /^(\d{1,2}|MON|TUE|WED|THU|FRI|SAT|SUN)L$/;
export const weekOrderWeekSpecificRegex =
  /^(\d{1,2}|MON|TUE|WED|THU|FRI|SAT|SUN)#(\d{1,2})$/;

abstract class Unit {
  public _expressSplit: string;
  constructor(expressSplit: string) {
    this._expressSplit = expressSplit;
  }
  abstract validate(): boolean;
}

class SecondUnit extends Unit {
  validate() {
    const expressSplit = this._expressSplit;
    return (
      everyRegex.test(expressSplit) ||
      intervalRegex.test(expressSplit) ||
      specificRegexNumber.test(expressSplit) ||
      specificRegexNumbers.test(expressSplit) ||
      rangeRegex.test(expressSplit)
    );
  }
}

class MinuteUnit extends Unit {
  validate() {
    const expressSplit = this._expressSplit;
    return (
      everyRegex.test(expressSplit) ||
      intervalRegex.test(expressSplit) ||
      specificRegexNumber.test(expressSplit) ||
      specificRegexNumbers.test(expressSplit) ||
      rangeRegex.test(expressSplit)
    );
  }
}
class HourUnit extends Unit {
  validate() {
    const expressSplit = this._expressSplit;
    return (
      everyRegex.test(expressSplit) ||
      intervalRegex.test(expressSplit) ||
      specificRegexNumber.test(expressSplit) ||
      specificRegexNumbers.test(expressSplit) ||
      rangeRegex.test(expressSplit)
    );
  }
}

class DayUnit extends Unit {
  validate() {
    const expressSplit = this._expressSplit;
    return (
      everyRegex.test(expressSplit) ||
      intervalRegex.test(expressSplit) ||
      specificRegexNumber.test(expressSplit) ||
      specificRegexNumbers.test(expressSplit) ||
      rangeRegex.test(expressSplit) ||
      ignoreRegex.test(expressSplit) ||
      nearestWorkingDayRegex.test(expressSplit) ||
      lastDayRegex.test(expressSplit) ||
      lastWorkingDayRegex.test(expressSplit)
    );
  }
}

class MonthUnit extends Unit {
  validate() {
    const expressSplit = this._expressSplit;
    return (
      everyRegex.test(expressSplit) ||
      monthIntervalRegex.test(expressSplit) ||
      monthSpecificRegexSingle.test(expressSplit) ||
      monthSpecificRegexMultiple.test(expressSplit) ||
      rangeRegex.test(expressSplit) ||
      monthRangeStrRegex.test(expressSplit)
    );
  }
}

class WeekUnit extends Unit {
  validate() {
    const express = this._expressSplit;
    return (
      everyRegex.test(express) ||
      ignoreRegex.test(express) ||
      weekIntervalRegex.test(express) ||
      weekSpecificRegexSingle.test(express) ||
      weekSpecificRegexMultiple.test(express) ||
      specificRegexNumber.test(express) ||
      rangeRegex.test(express) ||
      weekRangeStrRegex.test(express) ||
      lastDayRegex.test(express) ||
      weekMonthWeekLastDayRegex.test(express) ||
      weekOrderWeekSpecificRegex.test(express)
    );
  }
}

export class CronExpress {
  private _cronExpress: string;

  constructor(cronExpress: string) {
    this._cronExpress = cronExpress;
  }

  expressSplit(cronExpress: string) {
    const cronPiece = cronExpress.split(" ");
    return {
      second: cronPiece[0],
      minute: cronPiece[1],
      hour: cronPiece[2],
      day: cronPiece[3],
      month: cronPiece[4],
      week: cronPiece[5],
    };
  }

  validString(expressSplit: string) {
    return isString(expressSplit) && expressSplit.length > 0;
  }

  validate() {
    const cronExpress = this._cronExpress;
    if (!cronExpress) {
      return false;
    }
    const { second, minute, hour, day, month, week } =
      this.expressSplit(cronExpress);
    if (
      !this.validString(second) ||
      !this.validString(minute) ||
      !this.validString(hour) ||
      !this.validString(day) ||
      !this.validString(month) ||
      !this.validString(week)
    ) {
      return false;
    }

    return (
      new SecondUnit(second).validate() &&
      new MinuteUnit(minute).validate() &&
      new HourUnit(hour).validate() &&
      new DayUnit(day).validate() &&
      new MonthUnit(month).validate() &&
      new WeekUnit(week).validate()
    );
  }
}
