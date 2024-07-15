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
import {
  everyRegex,
  intervalRegex,
  specificRegexNumber,
  specificRegexNumbers,
  rangeRegex,
} from "../utils/cronParser";

type Props = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export enum SecondEnum {
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

const unit = UnitEnum.Second;
export const Second = (props: Props) => {
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

  const [type, setType] = useState<SecondEnum>(SecondEnum.EVERY);
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
    if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(SecondEnum.EVERY);
    } else if (intervalRegex.test(raw)) {
      const match = raw.match(intervalRegex)!;
      defaultSplitValueRef.current.interval = {
        start: Number(match[1]),
        interval: Number(match[2]),
      };
      setType(SecondEnum.INTERVAL);
    } else if (specificRegexNumber.test(raw)) {
      defaultSplitValueRef.current.specific = [Number(raw)];
      setType(SecondEnum.SPECIFIC);
    } else if (specificRegexNumbers.test(raw)) {
      defaultSplitValueRef.current.specific = raw
        .split(",")
        .map((item) => Number(item));
      setType(SecondEnum.SPECIFIC);
    } else if (rangeRegex.test(raw)) {
      const match = raw.match(rangeRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(SecondEnum.RANGE);
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
      key: SecondEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(SecondEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(SecondEnum.EVERY);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: SecondEnum.RANGE,
      label: "区间",
      component: (
        <Range
          ref={(refObj) => {
            if (refObj) {
              registerHandler(SecondEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(rangeValue) => {
            setType(SecondEnum.RANGE);
            changeValue(formatToCronRangeString(rangeValue));
          }}
        ></Range>
      ),
    },
    {
      key: SecondEnum.INTERVAL,
      label: "间隔",
      component: (
        <Interval
          ref={(refObj) => {
            if (refObj) {
              registerHandler(SecondEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(intervalValue) => {
            setType(SecondEnum.INTERVAL);
            changeValue(formatToCronIntervalString(intervalValue));
          }}
        ></Interval>
      ),
    },
    {
      key: SecondEnum.SPECIFIC,
      label: "指定",
      component: (
        <Specific
          ref={(refObj) => {
            if (refObj) {
              registerHandler(SecondEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(specificValue) => {
            setType(SecondEnum.SPECIFIC);
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
          const type = e.target.value as SecondEnum;
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
