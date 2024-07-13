import React, { useEffect, useMemo, useState } from "react";
import { Input, Tabs } from "antd";
import { UnitEnum, unitLabels } from "../../constants";
import { Second } from "../Second";
import { Minute } from "../Minute";
import { Hour } from "../Hour";
import { Day } from "../Day";
import { Month } from "../Month";
import { Week } from "../Week";
import { getUnitIndex } from "../../utils";

type Props = {
  humanReadableParser: (cronExpress: string) => string;
  value: string;
  onChange: (value: string) => void;
};
export const CronCore = (props: Props) => {
  const { humanReadableParser, value: cronExpress, onChange } = props;
  const { second, minute, hour, day, month, week, year } = useMemo(() => {
    const cronPiece = cronExpress.split(" ");
    return {
      second: cronPiece[0],
      minute: cronPiece[1],
      hour: cronPiece[2],
      day: cronPiece[3],
      month: cronPiece[4],
      week: cronPiece[5],
      year: cronPiece[6],
    };
  }, [cronExpress]);
  const [explain, setExplain] = useState<string>();

  const handleNormalChange = (unit: UnitEnum, value: string) => {
    let cronPiece = cronExpress.split(" ");
    const unitIndex = getUnitIndex(unit);
    cronPiece[unitIndex] = value;
    onChange(cronPiece.join(" "));
  };

  const handleDayUnitChange = (value: string) => {
    let cronPiece = cronExpress.split(" ");
    const dayUnitIndex = getUnitIndex(UnitEnum.Day);
    const weekUnitIndex = getUnitIndex(UnitEnum.Week);
    cronPiece[dayUnitIndex] = value;
    if (value !== "?") {
      cronPiece[weekUnitIndex] = "?";
    }
    onChange(cronPiece.join(" "));
  };

  const handleWeekUnitChange = (value: string) => {
    let cronPiece = cronExpress.split(" ");
    const dayUnitIndex = getUnitIndex(UnitEnum.Day);
    const weekUnitIndex = getUnitIndex(UnitEnum.Week);
    cronPiece[weekUnitIndex] = value;
    if (value !== "?") {
      cronPiece[dayUnitIndex] = "?";
    }
    onChange(cronPiece.join(" "));
  };

  useEffect(() => {
    setExplain(humanReadableParser(cronExpress));
  }, [cronExpress]);

  return (
    <div>
      <div>{explain}</div>
      <Input value={cronExpress} disabled></Input>
      <Tabs
        className="react-cron-ui-tabs"
        defaultActiveKey={UnitEnum.Second}
        type="card"
      >
        <Tabs.TabPane tab={unitLabels[UnitEnum.Second]} key={UnitEnum.Second}>
          <div className="react-cron-ui-panel">
            <Second
              value={second}
              onChange={(value) => {
                handleNormalChange(UnitEnum.Second, value);
              }}
            ></Second>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={unitLabels[UnitEnum.Minute]} key={UnitEnum.Minute}>
          <div className="react-cron-ui-panel">
            <Minute
              value={minute}
              onChange={(value) => {
                handleNormalChange(UnitEnum.Minute, value);
              }}
            ></Minute>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={unitLabels[UnitEnum.Hour]} key={UnitEnum.Hour}>
          <div className="react-cron-ui-panel">
            <Hour
              value={hour}
              onChange={(value) => {
                handleNormalChange(UnitEnum.Hour, value);
              }}
            ></Hour>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={unitLabels[UnitEnum.Day]} key={UnitEnum.Day}>
          <div className="react-cron-ui-panel">
            <Day
              value={day}
              onChange={(value) => {
                handleDayUnitChange(value);
              }}
            ></Day>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={unitLabels[UnitEnum.Month]} key={UnitEnum.Month}>
          <div className="react-cron-ui-panel">
            <Month
              value={month}
              onChange={(value) => {
                handleNormalChange(UnitEnum.Month, value);
              }}
            ></Month>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab={unitLabels[UnitEnum.Week]} key={UnitEnum.Week}>
          <div className="react-cron-ui-panel">
            <Week
              value={week}
              onChange={(value) => {
                handleWeekUnitChange(value);
              }}
            ></Week>
          </div>
        </Tabs.TabPane>
        {/* 年的不常用，先注释 */}
        {/* <Tabs.TabPane tab={unitLabels[UnitEnum.Year]} key={UnitEnum.Year}>
          <div className="react-cron-ui-panel">
            <Year
              value={year}
              onChange={(value) => {
                handleNormalChange(UnitEnum.Year, value);
              }}
            ></Year>
          </div>
        </Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};
