/**
 * 包裹CronCore，提供编辑器功能和cron表达式校验功能
 */

import { Button, Space } from "antd";
import { CronCore } from "../CronCore";
import "../../style/index.css";
import React, { useEffect, useState } from "react";
import { CronExpress } from "../../utils/cronParser";

type Props = {
  humanReadableParser: (cronExpress: string) => string;
  defaultValue?: string;
  onCancel: () => void;
  onConfirm: (value: string) => void;
};

export const defaultValidValue = "* * * * * *";

export const CronEditor = (props: Props) => {
  const {
    humanReadableParser,
    defaultValue = defaultValidValue,
    onCancel,
    onConfirm,
  } = props;

  const [innerValue, setInnerValue] = useState<string>(defaultValidValue); // 合法的cron表达式

  useEffect(() => {
    try {
      if (!defaultValue) {
        setInnerValue(defaultValidValue);
        return;
      }
      const cronExpress = new CronExpress(defaultValue);
      if (cronExpress.validate()) {
        setInnerValue(defaultValue);
      } else {
        setInnerValue(defaultValidValue);
      }
    } catch (e: any) {
      console.log(e?.message);
      setInnerValue(defaultValidValue);
    }
  }, []);

  return (
    <div className="react-cron-ui-editor">
      <CronCore
        humanReadableParser={humanReadableParser}
        value={innerValue}
        onChange={(value) => {
          setInnerValue(value);
        }}
      ></CronCore>
      <div style={{ display: "flex", marginTop: "1rem" }}>
        <Space style={{ marginLeft: "auto" }}>
          <Button
            onClick={() => {
              onCancel();
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onConfirm(innerValue);
              onCancel();
            }}
          >
            确定
          </Button>
        </Space>
      </div>
    </div>
  );
};
