import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange, weekOptions } from "../constants";
import { Checkbox } from "antd";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

type Props = {
  unit: UnitEnum;
  defaultValue?: number[];
  value?: number[];
  onChange: (value: number[]) => void;
};
export const formatToCronWeekSpecificString = (specificValue: number[]) => {
  return specificValue.join(",");
};

export const WeekSpecific = forwardRef<Ref, Props>((props, ref) => {
  const { unit, value: propsValue, defaultValue, onChange } = props;
  const [mergedValue, setValue] = useMergeState([UnitRange[unit].min], {
    value: propsValue,
    defaultValue,
  });
  function changeMergedValue(value: number[]) {
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }

  const getValue = () => {
    return formatToCronWeekSpecificString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <div>
      <Checkbox.Group
        value={mergedValue}
        onChange={(checkedValue) => {
          if (checkedValue.length === 0) {
          } else {
            changeMergedValue(checkedValue as number[]);
          }
        }}
      >
        <span style={{ marginRight: "8px" }}>在星期</span>
        {weekOptions.map((item) => {
          return (
            <Checkbox
              style={{
                marginLeft: 0,
                marginRight: "8px",
              }}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </Checkbox>
          );
        })}
        <span>上执行</span>
      </Checkbox.Group>
    </div>
  );
});
