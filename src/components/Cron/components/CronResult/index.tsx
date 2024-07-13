import React, { useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import parser, { CronExpression } from "cron-parser";

import "../../style/index.css";

type Props = {
  humanReadableParser: (cronExpress: string) => string;
  cronExpress: string;
};

export const CronResult = (props: Props) => {
  const { humanReadableParser, cronExpress } = props;
  const [error, setError] = useState<string>();
  const [recentFiveTime, setRecentFiveTime] = useState<string[]>();
  const [explain, setExplain] = useState<string>();

  const getRecentFiveTime = useCallback((interval: CronExpression) => {
    const result = [];
    for (let i = 0; i < 5; i++) {
      // 格式化时间为YYYY-MM-DD HH:mm:ss
      result.push(
        dayjs(interval.next().toDate()).format("YYYY-MM-DD HH:mm:ss")
      );
    }
    return result;
  }, []);

  useEffect(() => {
    try {
      const interval = parser.parseExpression(cronExpress);
      setRecentFiveTime(getRecentFiveTime(interval));
      setExplain(humanReadableParser(cronExpress));
    } catch (e: any) {
      setError(e?.message);
      setExplain(undefined);
    }
  }, [cronExpress]);

  return (
    <div>
      {explain && <div>解析：{explain}</div>}
      <div>最近五次执行时间：</div>
      {error ? (
        <div className="react-cron-ui-errorLabel">{error}</div>
      ) : (
        <div>
          {recentFiveTime?.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      )}
    </div>
  );
};
