import React, { useRef, useState, useEffect } from "react";

export const useHandlerPool = () => {
  const poolRef = useRef<Record<string, Function>>({});

  const registerHandler = (key: string, handler: Function) => {
    poolRef.current[key] = handler;
  };

  const unregisterHandler = (key: string) => {
    delete poolRef.current[key];
  };

  const getHandler = (key: string) => {
    return poolRef.current[key];
  };

  return {
    registerHandler,
    unregisterHandler,
    getHandler,
  };
};

export function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const { defaultValue, value: propsValue } = props || {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState<T>(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if (defaultValue !== undefined) {
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  return [mergedValue, setStateValue];
}
