import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, unitLabels } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};

const emptyValue = "";
export const Empty = forwardRef<Ref, Props>((props, ref) => {
  const { unit, onChange } = props;

  const getValue = () => {
    return emptyValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(emptyValue);
      }}
    >
      不使用{unitLabels[unit]}域
    </span>
  );
});
