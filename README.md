# react-cron-ui

react-cron-ui 是一个用于方便输入和编辑 cron 表达式的 React 组件。它提供了直观的用户界面，使用户能够轻松创建和修改 cron 表达式。

![react-cron-ui 预览](https://raw.githubusercontent.com/kelokeloo/react-cron-ui/main/public/demo.jpg)

## 特性

- 简单易用的 cron 表达式输入界面
- 支持自定义人类可读的 cron 表达式解析
- 可选显示最近 5 次执行时间
- 兼容 React 16+ 和 Ant Design 4
- 支持周的开始索引 sunStartIndex，周可以从 1 开始也可以从 0 开始

## 安装

```bash
npm install react-cron-ui
```

## 使用方法

```tsx
import React, { useState } from "react";
import { Cron } from "react-cron-ui";
import "react-cron-ui/dist/esm/index.css";

function App() {
  const [express, setExpress] = useState("* * * * * *");

  return (
    <Cron
      value={express}
      onChange={(value) => {
        setExpress(value);
      }}
    ></Cron>
  );
}

export default App;
```

## API

### Cron 组件属性 (CronProps)

|        属性         |              类型               |       默认值       |                                                                  描述                                                                   |
| :-----------------: | :-----------------------------: | :----------------: | :-------------------------------------------------------------------------------------------------------------------------------------: |
|     showResult      |             boolean             |        true        | 是否显示最近 5 次执行时间的按钮,需要注意的是，这里的结果只在 SunStartIndex.Zero 下有效，因此 SunStartIndex.One 的情况下需要关闭这个功能 |
| humanReadableParser | (cronExpress: string) => string |         -          |                                                  自定义 cron 表达式的人类可读解析函数                                                   |
|    defaultValue     |             string              |         -          |                                                          默认的 cron 表达式值                                                           |
|        value        |             string              |         -          |                                                    当前的 cron 表达式值（受控模式）                                                     |
|      onChange       |     (value: string) => void     |         -          |                                                       cron 表达式变化时的回调函数                                                       |
|    sunStartIndex    |          SunStartIndex          | SunStartIndex.Zero |                        设置周的开始索引，SunStartIndex 可从组件导出，默认周从 0 开始，也就是 SunStartIndex.Zero                         |

### 其他导出

- `validCronExpress`: 使用 cron-parser 对 cron 表达式进行校验的函数
- `CronProps`: Cron 组件属性的 TypeScript 接口

## 兼容性

- React 16+
- Ant Design 4

## 许可证

MIT License

## 贡献

欢迎提交 issues 和 pull requests 来帮助改进这个项目。
