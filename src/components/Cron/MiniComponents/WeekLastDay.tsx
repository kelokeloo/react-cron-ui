import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};

export const weekLastDayValue = "L";
export const WeekLastDay = forwardRef<Ref, Props>((props, ref) => {
  const { onChange } = props;

  const getValue = () => {
    return weekLastDayValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(weekLastDayValue);
      }}
    >
      每周最后一日(周六)
    </span>
  );
});
