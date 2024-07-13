import React, { forwardRef, useImperativeHandle } from "react";
import { UnitEnum, unitLabels } from "../constants";
import { Ref } from "./interface";

type Props = {
  unit: UnitEnum;
  onChange: (value: string) => void;
};
export const ignoreValue = "?";

export const Ignore = forwardRef<Ref, Props>((props, ref) => {
  const { unit, onChange } = props;

  const getValue = () => {
    return ignoreValue;
  };

  useImperativeHandle(ref, () => ({
    getValue,
  }));

  return (
    <span
      onClick={() => {
        onChange(ignoreValue);
      }}
    >
      忽略{unitLabels[unit]}域
    </span>
  );
});
