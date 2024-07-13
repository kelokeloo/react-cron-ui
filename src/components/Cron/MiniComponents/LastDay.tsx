import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};

export const lastDayValue = "L";
export const LastDay = forwardRef<Ref, Props>((props, ref) => {
  const { onChange } = props;

  const getValue = () => {
    return lastDayValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(lastDayValue);
      }}
    >
      每月最后一日
    </span>
  );
});
