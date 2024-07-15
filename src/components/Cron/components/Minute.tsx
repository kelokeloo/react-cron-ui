import { Radio, Space, Tag } from "antd";
import React, { useMemo, useState } from "react";
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

type Props = {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export enum MinuteEnum {
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
const unit = UnitEnum.Minute;
export const Minute = (props: Props) => {
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

  const [type, setType] = useState<MinuteEnum>(MinuteEnum.EVERY);
  const defaultSplitValueRef = React.useRef<InnerValue>({
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
    const intervalRegex = /^(\d+)\/(\d+)$/; // 匹配间隔
    const specificRegexNumber = /^\d+$/; // 匹配单个数字的情况
    const specificRegexNumbers = /^(\d+,)*\d+$/; // 匹配“,”分隔的数字
    const rangeRegex = /^(\d+)-(\d+)$/; // 匹配区间格式

    if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(MinuteEnum.EVERY);
    } else if (intervalRegex.test(raw)) {
      const match = raw.match(intervalRegex)!;
      defaultSplitValueRef.current.interval = {
        start: Number(match[1]),
        interval: Number(match[2]),
      };
      setType(MinuteEnum.INTERVAL);
    } else if (specificRegexNumber.test(raw)) {
      defaultSplitValueRef.current.specific = [Number(raw)];
      setType(MinuteEnum.SPECIFIC);
    } else if (specificRegexNumbers.test(raw)) {
      defaultSplitValueRef.current.specific = raw
        .split(",")
        .map((item) => Number(item));
      setType(MinuteEnum.SPECIFIC);
    } else if (rangeRegex.test(raw)) {
      const match = raw.match(rangeRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(MinuteEnum.RANGE);
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
      key: MinuteEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MinuteEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(MinuteEnum.RANGE);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: MinuteEnum.RANGE,
      label: "区间",
      component: (
        <Range
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MinuteEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(rangeValue) => {
            setType(MinuteEnum.RANGE);
            changeValue(formatToCronRangeString(rangeValue));
          }}
        ></Range>
      ),
    },
    {
      key: MinuteEnum.INTERVAL,
      label: "间隔",
      component: (
        <Interval
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MinuteEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(intervalValue) => {
            setType(MinuteEnum.INTERVAL);
            changeValue(formatToCronIntervalString(intervalValue));
          }}
        ></Interval>
      ),
    },
    {
      key: MinuteEnum.SPECIFIC,
      label: "指定",
      component: (
        <Specific
          ref={(refObj) => {
            if (refObj) {
              registerHandler(MinuteEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(specificValue) => {
            setType(MinuteEnum.SPECIFIC);
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
          const type = e.target.value as MinuteEnum;
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
