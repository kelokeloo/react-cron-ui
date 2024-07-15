import { Radio, Space, Tag } from "antd";
import React, { useMemo, useRef, useState } from "react";
import {
  Interval,
  IntervalValue,
  formatToCronIntervalString,
} from "../MiniComponents/Interval";
import { BriefMonth, UnitEnum, UnitRange } from "../constants";
import {
  Specific,
  formatToCronSpecificString,
} from "../MiniComponents/Specific";
import {
  Range,
  RangeValue,
  formatToCronRangeString,
} from "../MiniComponents/Range";
import { Every, everyValue } from "../MiniComponents/Every";
import { useHandlerPool, useMergeState } from "../hooks";
import { getMonthNum, isMonthStr } from "../utils";

type Props = {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export enum MonthEnum {
  EVERY = "every", // *
  INTERVAL = "interval", // 间隔 3/5
  SPECIFIC = "specific", // 指定 2,3,4
  RANGE = "range", // 区间 2-4
}

export type InnerValue = {
  every: "*";
  interval: IntervalValue;
  specific: number[];
  range: RangeValue;
};
const unit = UnitEnum.Month;
export const Month = (props: Props) => {
  const { defaultValue, value: propsValue, onChange } = props;

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

  const [type, setType] = useState<MonthEnum>(MonthEnum.EVERY);
  const defaultSplitValueRef = useRef<InnerValue>({
    every: everyValue,
    interval: {
      start: UnitRange[unit].min,
      interval: 1,
    },
    specific: [UnitRange[unit].min],
    range: {
      min: UnitRange[unit].min,
      max: UnitRange[unit].min + 1,
    },
  });
  const { registerHandler, getHandler } = useHandlerPool();

  const parserMergedValue = (raw: string) => {
    const everyRegex = /^\*$/; // 匹配全部
    const intervalRegex =
      /^(\d+|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\/(\d+)$/; // 匹配间隔
    const specificRegexSingle =
      /^(\d+|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/; // 匹配单个月份的情况
    const specificRegexMultiple =
      /^(\d{1,2}|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(,(\d{1,2}|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))+$/; // 匹配“,”分隔的月份
    const rangeNumRegex = /^(\d+)-(\d+)$/; // 匹配数字区间格式
    const rangeStrRegex =
      /^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/; // 匹配字符区间格式

    if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(MonthEnum.EVERY);
    } else if (intervalRegex.test(raw)) {
      const match = raw.match(intervalRegex)!;
      if (isMonthStr(match[1])) {
        const monthNum = getMonthNum(match[1] as BriefMonth);
        defaultSplitValueRef.current.interval = {
          start: monthNum,
          interval: Number(match[2]),
        };
      } else {
        defaultSplitValueRef.current.interval = {
          start: Number(match[1]),
          interval: Number(match[2]),
        };
      }
      setType(MonthEnum.INTERVAL);
    } else if (specificRegexSingle.test(raw)) {
      const match = raw.match(specificRegexSingle)!;
      if (isMonthStr(match[1])) {
        defaultSplitValueRef.current.specific = [
          getMonthNum(match[1] as BriefMonth),
        ];
      } else {
        defaultSplitValueRef.current.specific = [Number(match[1])];
      }
      setType(MonthEnum.SPECIFIC);
    } else if (specificRegexMultiple.test(raw)) {
      defaultSplitValueRef.current.specific = raw.split(",").map((item) => {
        if (isMonthStr(item)) {
          return getMonthNum(item as BriefMonth);
        } else {
          return Number(item);
        }
      });
      setType(MonthEnum.SPECIFIC);
    } else if (rangeNumRegex.test(raw)) {
      const match = raw.match(rangeNumRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(MonthEnum.RANGE);
    } else if (rangeStrRegex.test(raw)) {
      const match = raw.match(rangeStrRegex)!;
      defaultSplitValueRef.current.range = {
        min: getMonthNum(match[1] as BriefMonth),
        max: getMonthNum(match[2] as BriefMonth),
      };
      setType(MonthEnum.RANGE);
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
      key: MonthEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MonthEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(MonthEnum.EVERY);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: MonthEnum.RANGE,
      label: "区间",
      component: (
        <Range
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MonthEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(rangeValue) => {
            setType(MonthEnum.RANGE);
            changeValue(formatToCronRangeString(rangeValue));
          }}
        ></Range>
      ),
    },
    {
      key: MonthEnum.INTERVAL,
      label: "间隔",
      component: (
        <Interval
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MonthEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(intervalValue) => {
            setType(MonthEnum.INTERVAL);
            changeValue(formatToCronIntervalString(intervalValue));
          }}
        ></Interval>
      ),
    },
    {
      key: MonthEnum.SPECIFIC,
      label: "指定",
      component: (
        <Specific
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MonthEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(specificValue) => {
            setType(MonthEnum.SPECIFIC);
            changeValue(formatToCronSpecificString(specificValue));
          }}
        ></Specific>
      ),
    },
  ];

  return (
    <div>
      <Radio.Group
        value={type}
        onChange={(e) => {
          const type = e.target.value as MonthEnum;
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
