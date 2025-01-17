import { Button, Input, Popover } from "antd";
import React, { useState } from "react";
import "./style/index.css";
import { useMergeState } from "./hooks";
import { CronEditor } from "./components/CronEditor";
import { CronResult } from "./components/CronResult";
import "./style/index.css";
import cronstrue from "cronstrue";
import "cronstrue/locales/zh_CN";

export const inner_humanReadableParser = (
  cronExpress: string,
  weekStart: SunStartIndex
) => {
  try {
    return cronstrue.toString(cronExpress, {
      locale: "zh_CN",
      dayOfWeekStartIndexZero: weekStart === SunStartIndex.Zero ? true : false,
    });
  } catch (error) {
    return error as string;
  }
};

export enum SunStartIndex {
  Zero = 0,
  One = 1,
}
export type Props = {
  showResult?: boolean; // 是否显示最近5次执行时间的按钮
  humanReadableParser?: (cronExpress: string) => string;
  defaultValue?: string;
  value?: string;
  sunStartIndex?: SunStartIndex;
  onChange?: (value: string) => void;
};
export const Cron = (props: Props) => {
  const {
    showResult = true,
    humanReadableParser: propsHumanReadableParser,
    sunStartIndex = SunStartIndex.Zero,
    value: propsValue,
    defaultValue,
    onChange,
  } = props;
  const [mergedValue, setValue] = useMergeState("* * * * * *", {
    value: propsValue,
    defaultValue,
  });
  function changeMergedValue(value: string) {
    // 通过propsValue判断是否是受控组件
    if (propsValue === undefined) {
      setValue(value);
    }
    onChange?.(value);
  }
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const openEditor = () => {
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
  };

  const humanReadableParser = (cronExpress: string) => {
    if (propsHumanReadableParser) {
      return propsHumanReadableParser(cronExpress);
    } else {
      return inner_humanReadableParser(cronExpress, sunStartIndex);
    }
  };

  return (
    <span className="react-cron-ui-cron">
      <Input
        className="react-cron-ui-input"
        placeholder="请输入cron表达式"
        value={mergedValue}
        onChange={(e) => {
          changeMergedValue(e.target.value);
        }}
      ></Input>
      <Popover
        visible={isEditorOpen}
        content={
          <CronEditor
            sunStartIndex={sunStartIndex}
            humanReadableParser={humanReadableParser}
            defaultValue={mergedValue}
            onCancel={() => {
              closeEditor();
            }}
            onConfirm={(value) => {
              changeMergedValue(value);
            }}
          ></CronEditor>
        }
        trigger="click"
        placement="bottomRight"
        destroyTooltipOnHide
      >
        <Button
          className="react-cron-ui-btn"
          onClick={() => {
            openEditor();
          }}
        >
          编辑
        </Button>
      </Popover>
      {showResult && (
        <Popover
          trigger="click"
          content={
            <CronResult
              humanReadableParser={humanReadableParser}
              cronExpress={mergedValue}
            ></CronResult>
          }
          destroyTooltipOnHide
        >
          <Button className="react-cron-ui-btn">查看结果</Button>
        </Popover>
      )}
    </span>
  );
};
