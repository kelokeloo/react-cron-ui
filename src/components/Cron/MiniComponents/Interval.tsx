import { InputNumber, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange, unitLabels } from "../constants";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

type Props = {
  unit: UnitEnum;
  defaultValue?: IntervalValue;
  value?: IntervalValue;
  onChange?: (value: IntervalValue) => void;
};

export type BriefMonth =
  | "JAN"
  | "FEB"
  | "MAR"
  | "APR"
  | "MAY"
  | "JUN"
  | "JUL"
  | "AUG"
  | "SEP"
  | "OCT"
  | "NOV"
  | "DEC";

export type IntervalValue = {
  start: number | BriefMonth;
  interval: number;
};

export const formatToCronIntervalString = (intervalValue: IntervalValue) => {
  return `${intervalValue.start}/${intervalValue.interval}`;
};

export const Interval = forwardRef<Ref, Props>((props, ref) => {
  const { unit, value: propsValue, defaultValue, onChange } = props;
  const [mergedValue, setValue] = useMergeState(
    { start: 0, interval: 1 },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: IntervalValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronIntervalString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <Space>
      <span>在</span>
      <InputNumber
        min={UnitRange[unit].min}
        max={UnitRange[unit].max}
        size="small"
        value={mergedValue.start}
        onChange={(value) => {
          changeMergedValue({
            start: Number(value),
            interval: mergedValue.interval,
          });
        }}
      ></InputNumber>
      <span>{unitLabels[unit]}开始，之后每</span>
      <InputNumber
        min={1}
        max={UnitRange[unit].max}
        size="small"
        value={mergedValue.interval}
        onChange={(value) => {
          changeMergedValue({
            start: mergedValue.start,
            interval: Number(value),
          });
        }}
      ></InputNumber>
      <span>{unitLabels[unit]}执行一次</span>
    </Space>
  );
});
