import { Radio, Space, Tag } from "antd";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Interval,
  IntervalValue,
  formatToCronIntervalString,
} from "../MiniComponents/Interval";
import { UnitEnum } from "../constants";
import {
  Specific,
  SpecificEnum,
  formatToCronSpecificString,
} from "../MiniComponents/Specific";
import {
  Range,
  RangeValue,
  formatToCronRangeString,
} from "../MiniComponents/Range";
import { Every, everyValue } from "../MiniComponents/Every";
import { useHandlerPool, useMergeState } from "../hooks";
import { Empty } from "../MiniComponents/Empty";

type Props = {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export enum YearEnum {
  EMPTY = "empty", // 空
  EVERY = "every", // *
  INTERVAL = "interval", // 间隔 3/5
  SPECIFIC = "specific", // 指定 2,3,4
  RANGE = "range", // 区间 2-4
}

export type InnerValue = {
  empty: "";
  every: "*";
  interval: IntervalValue;
  specific: number[];
  range: RangeValue;
};

const unit = UnitEnum.Year;
export const Year = (props: Props) => {
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

  useEffect(() => {
    console.log("mergedValue", mergedValue);
  }, [mergedValue]);

  const [type, setType] = useState<YearEnum>(YearEnum.EVERY);
  const defaultSplitValueRef = useRef<InnerValue>({
    empty: "",
    every: "*",
    interval: {
      start: 0,
      interval: 1,
    },
    specific: [2, 3, 4],
    range: {
      min: 2,
      max: 3,
    },
  });
  const { registerHandler, getHandler } = useHandlerPool();

  const parserMergedValue = (raw: string) => {
    const everyRegex = /^\*$/; // 匹配全部
    const intervalRegex = /^(\d+)\/(\d+)$/; // 匹配间隔
    const specificRegexNumber = /^\d+$/; // 匹配单个数字的情况
    const specificRegexNumbers = /^(\d+,)*\d+$/; // 匹配“,”分隔的数字
    const rangeRegex = /^(\d+)-(\d+)$/; // 匹配区间格式

    if (raw === "") {
      defaultSplitValueRef.current.empty = "";
      setType(YearEnum.EMPTY);
    } else if (everyRegex.test(raw)) {
      defaultSplitValueRef.current.every = everyValue;
      setType(YearEnum.EVERY);
    } else if (intervalRegex.test(raw)) {
      const match = raw.match(intervalRegex)!;
      defaultSplitValueRef.current.interval = {
        start: Number(match[1]),
        interval: Number(match[2]),
      };
      setType(YearEnum.INTERVAL);
    } else if (specificRegexNumber.test(raw)) {
      defaultSplitValueRef.current.specific = [Number(raw)];
      setType(YearEnum.SPECIFIC);
    } else if (specificRegexNumbers.test(raw)) {
      defaultSplitValueRef.current.specific = raw
        .split(",")
        .map((item) => Number(item));
      setType(YearEnum.SPECIFIC);
    } else if (rangeRegex.test(raw)) {
      const match = raw.match(rangeRegex)!;
      defaultSplitValueRef.current.range = {
        min: Number(match[1]),
        max: Number(match[2]),
      };
      setType(YearEnum.RANGE);
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
      key: YearEnum.EMPTY,
      label: "留空",
      component: (
        <Empty
          unit={unit}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(YearEnum.EMPTY, refObj.getValue);
            }
          }}
          onChange={(value) => {
            setType(YearEnum.EMPTY);
            changeValue(value);
          }}
        ></Empty>
      ),
    },
    {
      key: YearEnum.EVERY,
      label: "任意",
      component: (
        <Every
          ref={(refObj) => {
            if (refObj) {
              registerHandler(YearEnum.EVERY, refObj.getValue);
            }
          }}
          unit={unit}
          onChange={(value) => {
            setType(YearEnum.RANGE);
            changeValue(value);
          }}
        ></Every>
      ),
    },
    {
      key: YearEnum.RANGE,
      label: "区间",
      component: (
        <Range
          ref={(refObj) => {
            if (refObj) {
              registerHandler(YearEnum.RANGE, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.range}
          onChange={(rangeValue) => {
            setType(YearEnum.RANGE);
            changeValue(formatToCronRangeString(rangeValue));
          }}
        ></Range>
      ),
    },
    {
      key: YearEnum.INTERVAL,
      label: "间隔",
      component: (
        <Interval
          ref={(refObj) => {
            if (refObj) {
              registerHandler(YearEnum.INTERVAL, refObj.getValue);
            }
          }}
          unit={unit}
          value={splitValue.interval}
          onChange={(intervalValue) => {
            setType(YearEnum.INTERVAL);
            changeValue(formatToCronIntervalString(intervalValue));
          }}
        ></Interval>
      ),
    },
    {
      key: YearEnum.SPECIFIC,
      label: "指定",
      component: (
        <Specific
          type={SpecificEnum.Select}
          ref={(refObj) => {
            if (refObj) {
              registerHandler(YearEnum.SPECIFIC, refObj.getValue);
            }
          }}
          value={splitValue.specific}
          unit={unit}
          onChange={(specificValue) => {
            setType(YearEnum.SPECIFIC);
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
          const type = e.target.value as YearEnum;
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
