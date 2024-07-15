import { Radio, Space, Tag } from "antd";
import React, { useMemo, useRef, useState } from "react";
import { BriefWeek, UnitEnum, UnitRange } from "../constants";
import { RangeValue } from "../MiniComponents/Range";
import { Every, everyValue } from "../MiniComponents/Every";
import { useHandlerPool, useMergeState } from "../hooks";
import { Ignore, ignoreValue } from "../MiniComponents/Ignore";
import {
  WeekRange,
  formatToCronWeekRangeString,
} from "../MiniComponents/WeekRange";
import { getWeekNum, isWeekStr } from "../utils";
import {
  WeekInterval,
  IntervalValue,
  formatToCronWeekIntervalString,
} from "../MiniComponents/WeekInterval";
import {
  WeekSpecific,
  formatToCronWeekSpecificString,
} from "../MiniComponents/WeekSpecific";
import { WeekLastDay, weekLastDayValue } from "../MiniComponents/WeekLastDay";
import {
  MonthWeekLastDay,
  WeekValue,
  formatToCronMonthWeekLastDayString,
} from "../MiniComponents/MonthWeekLastDay";
import {
  OrderWeekSpecific,
  OrderWeekValue,
  formatToCronOrderWeekSpecificString,
} from "../MiniComponents/OrderWeekSpecific";
import {
  everyRegex,
  ignoreRegex,
  weekIntervalRegex,
  weekSpecificRegexSingle,
  weekSpecificRegexMultiple,
  specificRegexNumbers,
  rangeRegex,
  weekRangeStrRegex,
  lastDayRegex,
  weekMonthWeekLastDayRegex,
  weekOrderWeekSpecificRegex,
} from "../utils/cronParser";
import { SunStartIndex } from "..";

type Props = {
  sunStartIndex: SunStartIndex;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export enum WeekEnum {
  EVERY = "every", // *
  IGNORE = "ignore", // ?
  INTERVAL = "interval", // 间隔 3/5
  SPECIFIC = "specific", // 指定 2,3,4
  RANGE = "range", // 区间 2-4
  WEEK_LAST_DAY = "week_last_day", // L 每周的最后一天
  MONTH_WEEK_LAST_DAY = "month_week_last_day", // 5L 每月的最后一个星期五
  ORDER_WEEK_SPECIFIC = "order_week_specific", // 2#3 第三周的星期二
}

export type InnerValue = {
  every: "*";
  ignore: "?";
  interval: IntervalValue;
  specific: number[];
  range: RangeValue;
  weekLastDay: "L";
  monthWeekLastDay: WeekValue;
  orderWeekSpecific: OrderWeekValue;
};

const unit = UnitEnum.Week;
export const Week = (props: Props) => {
  const { sunStartIndex, defaultValue, value: propsValue, onChange } = props;

  const [mergedValue, setValue] = useMergeState(everyValue, {
    value: propsValue,
    defaultValue: defaultValue,
  });
  function changeValue(value: string) {
    // 通过propsValue判断是否是受控组件
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const [type, setType] = useState<WeekEnum>(WeekEnum.EVERY);
  const min =
    sunStartIndex === SunStartIndex.Zero
      ? UnitRange[unit].min
      : UnitRange[unit].min + 1;
  const defaultSplitValueRef = useRef<InnerValue>({
    every: everyValue,
    ignore: ignoreValue,
    interval: {
      weekStart: min,
      weekInterval: 1,
    },
    specific: [min],
    range: {
      min: min,
      max: min + 1,
    },
    weekLastDay: weekLastDayValue,
    monthWeekLastDay: {
      week: min,
    },
    orderWeekSpecific: {
      order: 1,
      week: min,
    },
  });
  const { registerHandler, getHandler } = useHandlerPool();

  const parserMergedValue = (raw: string) => {
    if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(WeekEnum.EVERY);
    } else if (ignoreRegex.test(raw)) {
      defaultSplitValueRef.current.ignore = "?";
      setType(WeekEnum.IGNORE);
    } else if (weekIntervalRegex.test(raw)) {
      const match = raw.match(weekIntervalRegex)!;
      if (isWeekStr(match[1])) {
        const monthNum = getWeekNum(match[1] as BriefWeek);
        defaultSplitValueRef.current.interval = {
          weekStart: monthNum,
          weekInterval: Number(match[2]),
        };
      } else {
        defaultSplitValueRef.current.interval = {
          weekStart: Number(match[1]),
          weekInterval: Number(match[2]),
        };
      }
      setType(WeekEnum.INTERVAL);
    } else if (weekSpecificRegexSingle.test(raw)) {
      const match = raw.match(weekSpecificRegexSingle)!;
      if (isWeekStr(match[1])) {
        const weekNum = getWeekNum(match[1] as BriefWeek);
        defaultSplitValueRef.current.specific = [weekNum];
      } else {
        defaultSplitValueRef.current.specific = [Number(match[1])];
      }
      setType(WeekEnum.SPECIFIC);
    } else if (weekSpecificRegexMultiple.test(raw)) {
      defaultSplitValueRef.current.specific = raw.split(",").map((item) => {
        if (isWeekStr(item)) {
          return getWeekNum(item as BriefWeek);
        } else {
          return Number(item);
        }
      });
      setType(WeekEnum.SPECIFIC);
    } else if (specificRegexNumbers.test(raw)) {
      defaultSplitValueRef.current.specific = raw
        .split(",")
        .map((item) => Number(item));
      setType(WeekEnum.SPECIFIC);
    } else if (rangeRegex.test(raw)) {
      const match = raw.match(rangeRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(WeekEnum.RANGE);
    } else if (weekRangeStrRegex.test(raw)) {
      const match = raw.match(weekRangeStrRegex)!;
      defaultSplitValueRef.current.range = {
        min: getWeekNum(match[1] as BriefWeek),
        max: getWeekNum(match[2] as BriefWeek),
      };
      setType(WeekEnum.RANGE);
    } else if (lastDayRegex.test(raw)) {
      defaultSplitValueRef.current.weekLastDay = "L";
      setType(WeekEnum.WEEK_LAST_DAY);
    } else if (weekMonthWeekLastDayRegex.test(raw)) {
      const match = raw.match(weekMonthWeekLastDayRegex)!;
      if (isWeekStr(match[1])) {
        defaultSplitValueRef.current.monthWeekLastDay = {
          week: getWeekNum(match[1] as BriefWeek),
        };
      } else {
        defaultSplitValueRef.current.monthWeekLastDay = {
          week: Number(match[1]),
        };
      }
      setType(WeekEnum.MONTH_WEEK_LAST_DAY);
    } else if (weekOrderWeekSpecificRegex.test(raw)) {
      const match = raw.match(weekOrderWeekSpecificRegex)!;
      if (isWeekStr(match[1])) {
        defaultSplitValueRef.current.orderWeekSpecific = {
          order: Number(match[2]),
          week: getWeekNum(match[1] as BriefWeek),
        };
      } else {
        defaultSplitValueRef.current.orderWeekSpecific = {
          order: Number(match[2]),
          week: Number(match[1]),
        };
      }
      setType(WeekEnum.ORDER_WEEK_SPECIFIC);
    } else {
      throw new Error("不支持的格式");
    }
    return defaultSplitValueRef.current;
  };
  const splitValue = useMemo(() => {
    return parserMergedValue(mergedValue);
  }, [mergedValue]);

  const radioInfoList = [
    {
      key: WeekEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(WeekEnum.RANGE);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: WeekEnum.IGNORE,
      label: "忽略",
      component: (
        <Ignore
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.IGNORE, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(WeekEnum.IGNORE);
            changeValue(value);
          }}
        ></Ignore>
      ),
    },
    {
      key: WeekEnum.RANGE,
      label: "区间",
      component: (
        <WeekRange
          sunStartIndex={sunStartIndex}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(weekRangeValue) => {
            setType(WeekEnum.RANGE);
            changeValue(formatToCronWeekRangeString(weekRangeValue));
          }}
        ></WeekRange>
      ),
    },
    {
      key: WeekEnum.INTERVAL,
      label: "间隔",
      component: (
        <WeekInterval
          sunStartIndex={sunStartIndex}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(weekIntervalValue) => {
            setType(WeekEnum.INTERVAL);
            changeValue(formatToCronWeekIntervalString(weekIntervalValue));
          }}
        ></WeekInterval>
      ),
    },
    {
      key: WeekEnum.SPECIFIC,
      label: "指定",
      component: (
        <WeekSpecific
          sunStartIndex={sunStartIndex}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(weekSpecificValue) => {
            setType(WeekEnum.SPECIFIC);
            changeValue(formatToCronWeekSpecificString(weekSpecificValue));
          }}
        ></WeekSpecific>
      ),
    },
    {
      key: WeekEnum.WEEK_LAST_DAY,
      label: "每周最后一日",
      component: (
        <WeekLastDay
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.WEEK_LAST_DAY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(WeekEnum.WEEK_LAST_DAY);
            changeValue(value);
          }}
        ></WeekLastDay>
      ),
    },
    {
      key: WeekEnum.MONTH_WEEK_LAST_DAY,
      label: "每月最后一个星期几",
      component: (
        <MonthWeekLastDay
          sunStartIndex={sunStartIndex}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.MONTH_WEEK_LAST_DAY, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.monthWeekLastDay}
          onChange={(monthWeekLastDayValue) => {
            setType(WeekEnum.MONTH_WEEK_LAST_DAY);
            changeValue(
              formatToCronMonthWeekLastDayString(monthWeekLastDayValue)
            );
          }}
        ></MonthWeekLastDay>
      ),
    },
    {
      key: WeekEnum.ORDER_WEEK_SPECIFIC,
      label: "顺序",
      component: (
        <OrderWeekSpecific
          sunStartIndex={sunStartIndex}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(WeekEnum.ORDER_WEEK_SPECIFIC, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.orderWeekSpecific}
          onChange={(orderWeekSpecificValue) => {
            setType(WeekEnum.ORDER_WEEK_SPECIFIC);
            changeValue(
              formatToCronOrderWeekSpecificString(orderWeekSpecificValue)
            );
          }}
        ></OrderWeekSpecific>
      ),
    },
  ];

  return (
    <div>
      <Radio.Group
        value={type}
        onChange={(e) => {
          const type = e.target.value as WeekEnum;
          setType(type);
          const getValue = getHandler(type);
          if (getValue) {
            changeValue(getValue());
          }
        }}
      >
        <Space direction="vertical" style={{ display: "flex" }}>
          {radioInfoList.map((item) => {
            return (
              <div key={item.key}>
                <Radio value={item.key}>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <div>
                      <Tag color="blue">{item.label}</Tag>
                    </div>
                    <div style={{ flex: 1 }}>{item.component}</div>
                  </div>
                </Radio>
              </div>
            );
          })}
        </Space>
      </Radio.Group>
    </div>
  );
};
