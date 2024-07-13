import { Select, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, weekOptions } from "../constants";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

type Props = {
  unit: UnitEnum;
  defaultValue?: RangeValue;
  value?: RangeValue;
  onChange?: (value: RangeValue) => void;
};
export type RangeValue = {
  min: number;
  max: number;
};

export const formatToCronWeekRangeString = (rangeValue: RangeValue) => {
  return `${rangeValue.min}-${rangeValue.max}`;
};

export const WeekRange = forwardRef<Ref, Props>((props, ref) => {
  const { unit, value: propsValue, defaultValue, onChange } = props;
  const [mergedValue, setValue] = useMergeState(
    { min: 0, max: 1 },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: RangeValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const [error, setError] = React.useState<string>();

  const getValue = () => {
    return formatToCronWeekRangeString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  const handleBlur = () => {
    // 校验min和max的大小
    if (mergedValue.min > mergedValue.max - 1) {
      setError("最小值必须小于最大值");
      return;
    }
    setError(undefined);
    onChange?.({
      min: mergedValue.min,
      max: mergedValue.max,
    });
  };

  return (
    <div>
      <Space>
        <span>从星期</span>
        <Select
          size="small"
          showSearch
          style={{
            minWidth: "50px",
            marginRight: "8px",
          }}
          value={mergedValue.min}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          options={weekOptions}
          onChange={(value) => {
            changeMergedValue({ min: Number(value), max: mergedValue.max });
          }}
          onBlur={handleBlur}
        />
        <span>到星期</span>
        <Select
          size="small"
          showSearch
          style={{
            minWidth: "50px",
            marginRight: "8px",
          }}
          value={mergedValue.max}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          options={weekOptions}
          onChange={(value) => {
            changeMergedValue({ min: mergedValue.min, max: Number(value) });
          }}
          onBlur={handleBlur}
        />
        <span>执行</span>
      </Space>
      {error && <div className="react-cron-ui-errorLabel">{error}</div>}
    </div>
  );
});
