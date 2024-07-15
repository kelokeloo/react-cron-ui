import { InputNumber, Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  BriefWeek,
  UnitEnum,
  UnitRange,
  weekOptions_One,
  weekOptions_Zero,
} from "../constants";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";
import { SunStartIndex } from "..";

type Props = {
  sunStartIndex: SunStartIndex;
  unit: UnitEnum;
  defaultValue?: IntervalValue;
  value?: IntervalValue;
  onChange?: (value: IntervalValue) => void;
};

export type IntervalValue = {
  weekStart: number | BriefWeek;
  weekInterval: number;
};
export const formatToCronWeekIntervalString = (
  intervalValue: IntervalValue
) => {
  return `${intervalValue.weekStart}/${intervalValue.weekInterval}`;
};

export const WeekInterval = forwardRef<Ref, Props>((props, ref) => {
  const {
    sunStartIndex,
    unit,
    value: propsValue,
    defaultValue,
    onChange,
  } = props;
  const [mergedValue, setValue] = useMergeState(
    { weekStart: 0, weekInterval: 1 },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: IntervalValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronWeekIntervalString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <Space>
      <span>对每周，在星期</span>
      <Select
        size="small"
        showSearch
        style={{
          minWidth: "50px",
          marginRight: "8px",
        }}
        value={mergedValue.weekStart}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        options={
          sunStartIndex === SunStartIndex.Zero
            ? weekOptions_Zero
            : weekOptions_One
        }
        onChange={(value) => {
          changeMergedValue({
            weekStart: value,
            weekInterval: mergedValue.weekInterval,
          });
        }}
      />
      <span>开始，之后每</span>
      <InputNumber
        min={UnitRange[unit].min}
        max={UnitRange[unit].max}
        size="small"
        style={{
          width: "50px",
        }}
        value={mergedValue.weekInterval}
        onChange={(value) => {
          changeMergedValue({
            weekStart: mergedValue.weekStart,
            weekInterval: Number(value),
          });
        }}
      ></InputNumber>
      <span>天执行一次</span>
    </Space>
  );
});
