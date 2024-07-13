import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, UnitRange, unitLabels } from "../constants";
import { Checkbox, CheckboxProps, Select } from "antd";
import { isArray } from "lodash";
import "../style/index.css";
import { Ref } from "./interface";
import { useMergeState } from "../hooks";

export const SpecificValueMap = {
  // 针对UnitEnum.Second，生成0-59的数组
  [UnitEnum.Second]: Array.from({ length: 60 }, (_, index) => index),
  // 针对UnitEnum.Minute，生成0-59的数组
  [UnitEnum.Minute]: Array.from({ length: 60 }, (_, index) => index),
  // 针对UnitEnum.Hour，生成0-23的数组
  [UnitEnum.Hour]: Array.from({ length: 24 }, (_, index) => index),
  // 针对UnitEnum.Day，生成1-31的数组
  [UnitEnum.Day]: Array.from({ length: 31 }, (_, index) => index + 1),
  // 针对UnitEnum.Week，生成1-7的数组
  [UnitEnum.Week]: Array.from({ length: 7 }, (_, index) => index + 1),
  // 针对UnitEnum.Month，生成1-12的数组
  [UnitEnum.Month]: Array.from({ length: 12 }, (_, index) => index + 1),
  // 针对UnitEnum.Year，生成1970-2099的数组
  [UnitEnum.Year]: Array.from({ length: 130 }, (_, index) => index + 1970),
};

export enum SpecificEnum {
  Radio = "radio",
  Select = "select",
}

type Props = {
  type?: SpecificEnum;
  unit: UnitEnum;
  defaultValue?: number[];
  value?: number[];
  onChange: (value: number[]) => void;
};

export const formatToCronSpecificString = (specificValue: number[]) => {
  return specificValue.join(",");
};

export const Specific = forwardRef<Ref, Props>((props, ref) => {
  const {
    type = SpecificEnum.Radio,
    unit,
    value: propsValue,
    defaultValue,
    onChange,
  } = props;
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

  // ref
  const getValue = () => {
    return formatToCronSpecificString(mergedValue);
  };
  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <div>
      {type === SpecificEnum.Radio && (
        <Checkbox.Group
          value={mergedValue}
          onChange={(checkedValue) => {
            if (checkedValue.length === 0) {
            } else {
              changeMergedValue(checkedValue as number[]);
            }
          }}
        >
          <span style={{ marginRight: "8px" }}>在</span>
          {SpecificValueMap[unit].map((item) => (
            <Checkbox
              style={{
                marginLeft: 0,
                marginRight: "8px",
              }}
              value={item}
              key={item}
            >
              {item}
            </Checkbox>
          ))}
          <span>{unitLabels[unit]}上执行</span>
        </Checkbox.Group>
      )}
      {type === SpecificEnum.Select && (
        <div>
          <span style={{ marginRight: "8px" }}>在</span>
          <Select
            size="small"
            showSearch
            style={{
              minWidth: "180px",
              marginRight: "8px",
            }}
            mode="multiple"
            value={mergedValue}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
            onChange={(value) => {
              if (!isArray(value)) {
                changeMergedValue([]);
              } else {
                changeMergedValue(value as number[]);
              }
            }}
          >
            {SpecificValueMap[unit].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <span>{unitLabels[unit]}上执行</span>
        </div>
      )}
    </div>
  );
});
