import { InputNumber, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange } from "../constants";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

type Props = {
  unit: UnitEnum;
  value?: DayValue;
  defaultValue?: DayValue;
  onChange?: (value: DayValue) => void;
};
export type DayValue = {
  day: number;
};

export const formatToCronNearestWorkingDayString = (
  intervalValue: DayValue
) => {
  return `${intervalValue.day}W`;
};
export const NearestWorkingDay = forwardRef<Ref, Props>((props, ref) => {
  const { unit, value: propsValue, defaultValue, onChange } = props;
  const [mergedValue, setValue] = useMergeState(
    { day: UnitRange[unit].max },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: DayValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronNearestWorkingDayString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <div>
      <Space>
        <span>在每月</span>
        <InputNumber
          min={UnitRange[unit].min}
          max={UnitRange[unit].max}
          size="small"
          value={mergedValue.day}
          onChange={(value) => {
            changeMergedValue({ day: Number(value) });
          }}
        ></InputNumber>
        <span>日最近的工作日上执行</span>
      </Space>
    </div>
  );
});
