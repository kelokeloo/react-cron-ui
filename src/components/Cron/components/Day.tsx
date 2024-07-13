import { Radio, Space, Tag } from "antd";
import React, { useMemo, useRef, useState } from "react";
import {
  Interval,
  IntervalValue,
  formatToCronIntervalString,
} from "../MiniComponents/Interval";
import { UnitEnum, UnitRange } from "../constants";
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
import { Ignore, ignoreValue } from "../MiniComponents/Ignore";
import { LastDay, lastDayValue } from "../MiniComponents/LastDay";
import {
  LastWorkingDay,
  lastWorkingDayValue,
} from "../MiniComponents/LastWorkingDay";
import {
  DayValue,
  NearestWorkingDay,
  formatToCronNearestWorkingDayString,
} from "../MiniComponents/NearestWorkingDay";

type Props = {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export enum DayEnum {
  EVERY = "every", // *
  IGNORE = "ignore", // ?
  INTERVAL = "interval", // 间隔 3/5
  SPECIFIC = "specific", // 指定 2,3,4
  RANGE = "range", // 区间 2-4
  // WORKING_DAY = 'working_day', // W 工作日
  LAST_DAY = "last_day", // L 最后一天
  LAST_WORKING_DAY = "last_working_day", // LW 最后一个工作日
  NEAREST_WORKING_DAY = "nearest_working_day", // 5W 最近的工作日
}

export type InnerValue = {
  every: "*";
  ignore: "?";
  interval: IntervalValue;
  specific: number[];
  range: RangeValue;
  nearest_working_day: DayValue;
  last_day: "L";
  last_working_day: "LW";
};

const unit = UnitEnum.Day;
export const Day = (props: Props) => {
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

  const [type, setType] = useState<DayEnum>(DayEnum.EVERY);
  const defaultSplitValueRef = useRef<InnerValue>({
    every: everyValue,
    ignore: ignoreValue,
    interval: {
      start: UnitRange[unit].min,
      interval: 1,
    },
    specific: [UnitRange[unit].min],
    range: {
      min: UnitRange[unit].min,
      max: UnitRange[unit].min + 1,
    },
    nearest_working_day: {
      day: UnitRange[unit].min,
    },
    last_day: lastDayValue,
    last_working_day: lastWorkingDayValue,
  });
  const { registerHandler, getHandler } = useHandlerPool();

  const parserMergedValue = (raw: string) => {
    const everyRegex = /^\*$/; // 匹配全部
    const ignoreRegex = /^\?$/; // 匹配忽略
    const intervalRegex = /^(\d+)\/(\d+)$/; // 匹配间隔
    const specificRegexNumber = /^\d+$/; // 匹配单个数字的情况
    const specificRegexNumbers = /^(\d+,)*\d+$/; // 匹配“,”分隔的数字
    const rangeRegex = /^(\d+)-(\d+)$/; // 匹配区间格式
    const nearestWorkingDayRegex = /^(\d+)W$/; // 匹配最近的工作日
    const lastDayRegex = /^L$/; // 匹配最后一天
    const lastWorkingDayRegex = /^LW$/; // 匹配最后一个工作日

    if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(DayEnum.EVERY);
    } else if (ignoreRegex.test(raw)) {
      defaultSplitValueRef.current.ignore = "?";
      setType(DayEnum.IGNORE);
    } else if (intervalRegex.test(raw)) {
      const match = raw.match(intervalRegex)!;
      defaultSplitValueRef.current.interval = {
        start: Number(match[1]),
        interval: Number(match[2]),
      };
      setType(DayEnum.INTERVAL);
    } else if (specificRegexNumber.test(raw)) {
      defaultSplitValueRef.current.specific = [Number(raw)];
      setType(DayEnum.SPECIFIC);
    } else if (specificRegexNumbers.test(raw)) {
      defaultSplitValueRef.current.specific = raw
        .split(",")
        .map((item) => Number(item));
      setType(DayEnum.SPECIFIC);
    } else if (rangeRegex.test(raw)) {
      const match = raw.match(rangeRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(DayEnum.RANGE);
    } else if (nearestWorkingDayRegex.test(raw)) {
      const match = raw.match(nearestWorkingDayRegex)!;
      defaultSplitValueRef.current.nearest_working_day = {
        day: Number(match[1]),
      };
      setType(DayEnum.NEAREST_WORKING_DAY);
    } else if (lastDayRegex.test(raw)) {
      defaultSplitValueRef.current.last_day = "L";
      setType(DayEnum.LAST_DAY);
    } else if (lastWorkingDayRegex.test(raw)) {
      defaultSplitValueRef.current.last_working_day = "LW";
      setType(DayEnum.LAST_WORKING_DAY);
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
      key: DayEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(DayEnum.RANGE);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: DayEnum.IGNORE,
      label: "忽略",
      component: (
        <Ignore
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.IGNORE, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(DayEnum.IGNORE);
            changeValue(value);
          }}
        ></Ignore>
      ),
    },
    {
      key: DayEnum.RANGE,
      label: "区间",
      component: (
        <Range
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(rangeValue) => {
            setType(DayEnum.RANGE);
            changeValue(formatToCronRangeString(rangeValue));
          }}
        ></Range>
      ),
    },
    {
      key: DayEnum.INTERVAL,
      label: "间隔",
      component: (
        <Interval
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(intervalValue) => {
            setType(DayEnum.INTERVAL);
            changeValue(formatToCronIntervalString(intervalValue));
          }}
        ></Interval>
      ),
    },
    {
      key: DayEnum.SPECIFIC,
      label: "指定",
      component: (
        <Specific
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(specificValue) => {
            setType(DayEnum.SPECIFIC);
            changeValue(formatToCronSpecificString(specificValue));
          }}
        ></Specific>
      ),
    },
    {
      key: DayEnum.NEAREST_WORKING_DAY,
      label: "最近工作日",
      component: (
        <NearestWorkingDay
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.NEAREST_WORKING_DAY, refObj.getValue);
            }
          }}
          unit={UnitEnum.Day}
          value={splitValue.nearest_working_day}
          onChange={(nearestWorkingDayValue) => {
            setType(DayEnum.NEAREST_WORKING_DAY);
            changeValue(
              formatToCronNearestWorkingDayString(nearestWorkingDayValue)
            );
          }}
        ></NearestWorkingDay>
      ),
    },
    {
      key: DayEnum.LAST_DAY,
      label: "最后一日",
      component: (
        <LastDay
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.LAST_DAY, refObj.getValue);
            }
          }}
          unit={UnitEnum.Day}
          onChange={(value) => {
            setType(DayEnum.LAST_DAY);
            changeValue(value);
          }}
        ></LastDay>
      ),
    },
    {
      key: DayEnum.LAST_WORKING_DAY,
      label: "最后工作日",
      component: (
        <LastWorkingDay
          ref={(refObj) => {
            if (refObj) {
              registerHandler(DayEnum.LAST_WORKING_DAY, refObj.getValue);
            }
          }}
          unit={UnitEnum.Day}
          onChange={(value) => {
            setType(DayEnum.LAST_WORKING_DAY);
            changeValue(value);
          }}
        ></LastWorkingDay>
      ),
    },
  ];

  return (
    <div>
      <Radio.Group
        value={type}
        onChange={(e) => {
          const type = e.target.value as DayEnum;
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
              <div>
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
