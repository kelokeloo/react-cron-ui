import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange, weekOptions } from "../constants";
import { InputNumber, Select, Space } from "antd";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

export type OrderWeekValue = {
  order: number; // 第几周
  week: number; // 星期几
};

type Props = {
  unit: UnitEnum;
  value?: OrderWeekValue;
  defaultValue?: OrderWeekValue;
  onChange?: (value: OrderWeekValue) => void;
};
export const formatToCronOrderWeekSpecificString = (
  orderWeekSpecificValue: OrderWeekValue
) => {
  return `${orderWeekSpecificValue.week}#${orderWeekSpecificValue.order}`;
};
export const OrderWeekSpecific = forwardRef<Ref, Props>((props, ref) => {
  const { unit, value: propsValue, defaultValue, onChange } = props;
  const [mergedValue, setValue] = useMergeState(
    { order: 1, week: UnitRange[unit].min },
    { value: propsValue, defaultValue }
  );
  function changeMergedValue(value: OrderWeekValue) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronOrderWeekSpecificString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <div>
      <Space>
        <span>在每个月的第</span>
        <InputNumber
          size="small"
          min={1}
          max={5}
          style={{
            width: "50px",
          }}
          value={mergedValue.order}
          onChange={(value) => {
            changeMergedValue({
              order: Number(value),
              week: mergedValue.week,
            });
          }}
        ></InputNumber>
        <span>个星期</span>
        <Select
          size="small"
          showSearch
          style={{
            minWidth: "50px",
            marginRight: "8px",
          }}
          value={mergedValue.week}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          options={weekOptions}
          onChange={(value) => {
            changeMergedValue({
              order: mergedValue.order,
              week: Number(value),
            });
          }}
        />
        <span>上执行</span>
      </Space>
    </div>
  );
});
