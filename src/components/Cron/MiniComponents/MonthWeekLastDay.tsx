import { Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import {
  UnitEnum,
  UnitRange,
  weekOptions_One,
  weekOptions_Zero,
} from "../constants";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";
import { SunStartIndex } from "..";

type Props = {
  sunStartIndex: SunStartIndex;
  unit: UnitEnum;
  value?: WeekValue;
  defaultValue?: WeekValue;
  onChange?: (value: WeekValue) => void;
};
export type WeekValue = {
  week: number;
};

export const formatToCronMonthWeekLastDayString = (
  intervalValue: WeekValue
) => {
  return `${intervalValue.week}L`;
};

export const MonthWeekLastDay = forwardRef<Ref, Props>((props, ref) => {
  const {
    sunStartIndex,
    unit,
    value: propsValue,
    defaultValue,
    onChange,
  } = props;
  const [mergedValue, setValue] = useMergeState(
    { week: UnitRange[unit].max },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: WeekValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronMonthWeekLastDayString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <div>
      <Space>
        <span>每月最后一个星期</span>
        <Select
          size="small"
          showSearch
          style={{
            minWidth: "50px",
            marginRight: "8px",
          }}
          defaultValue={mergedValue.week}
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
            changeMergedValue({ week: Number(value) });
          }}
        />
      </Space>
    </div>
  );
});
