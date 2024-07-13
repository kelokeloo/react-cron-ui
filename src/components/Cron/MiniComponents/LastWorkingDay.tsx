import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};

export const lastWorkingDayValue = "LW";
export const LastWorkingDay = forwardRef<Ref, Props>((props, ref) => {
  const { onChange } = props;

  const getValue = () => {
    return lastWorkingDayValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(lastWorkingDayValue);
      }}
    >
      每月最后一个工作日
    </span>
  );
});
