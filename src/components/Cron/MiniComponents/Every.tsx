import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};

export const everyValue = "*";

const unitLabels = {
  [UnitEnum.Second]: "每秒都触发",
  [UnitEnum.Minute]: "每分钟都触发",
  [UnitEnum.Hour]: "每小时都触发",
  [UnitEnum.Day]: "每日都触发",
  [UnitEnum.Week]: "对每周，每天都触发",
  [UnitEnum.Month]: "每月都触发",
  [UnitEnum.Year]: "每年都触发",
};

export const Every = forwardRef<Ref, Props>((props, ref) => {
  const { unit, onChange } = props;

  const getValue = () => {
    return everyValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(everyValue);
      }}
    >
      {unitLabels[unit]}
    </span>
  );
});
