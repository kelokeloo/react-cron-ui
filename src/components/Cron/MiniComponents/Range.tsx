import { InputNumber, Space } from "antd";
import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange, unitLabels } from "../constants";
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
export const formatToCronRangeString = (rangeValue: RangeValue) => {
  return `${rangeValue.min}-${rangeValue.max}`;
};

export const Range = forwardRef<Ref, Props>((props, ref) => {
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

  // ref
  const getValue = () => {
    return formatToCronRangeString(mergedValue);
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
        <span>从</span>
        <InputNumber
          min={UnitRange[unit].min}
          max={UnitRange[unit].max}
          size="small"
          value={mergedValue.min}
          onChange={(value) => {
            changeMergedValue({ min: Number(value), max: mergedValue.max });
          }}
          onBlur={handleBlur}
        ></InputNumber>
        <span>到</span>
        <InputNumber
          min={UnitRange[unit].min}
          max={UnitRange[unit].max}
          size="small"
          value={mergedValue.max}
          onChange={(value) => {
            changeMergedValue({ min: mergedValue.min, max: Number(value) });
          }}
          onBlur={handleBlur}
        ></InputNumber>
        <span>{unitLabels[unit]}执行</span>
      </Space>
      {error && <div className="react-cron-ui-errorLabel">{error}</div>}
    </div>
  );
});
