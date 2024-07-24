import React, { useContext } from "react";
import "./List.css";
import { Button, ConfigProvider, Space } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { Card, List } from "antd";
import { css } from "@emotion/css";

const data = [
  {
    title: "금연",
    content: "금연 캠페인에 참여하세요",
  },
  {
    title: "게임 중독",
    content: "게임 중독을 예방하는 방법",
  },
  {
    title: "음주",
    content: "과음하지 맙시다",
  },
  {
    title: "릴스 중독",
    content: "릴스 중독에서 벗어나는 법",
  },
];
const GradientButton = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(
        .${rootPrefixCls}-btn-dangerous
      ) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: "";
        background: linear-gradient(135deg, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `;

  return (
    <ConfigProvider
      button={{
        className: linearGradientButton,
      }}
    >
      <Space>
        <Button type="primary" size="large" icon={<AntDesignOutlined />}>
          서명하기
        </Button>
      </Space>
    </ConfigProvider>
  );
};
const App = () => (
  <div
    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    {data.map((item, index) => (
      <Card
        key={index}
        title={<div className="card-title">{item.title}</div>}
        style={{ width: "100%", textAlign: "left", marginBottom: "16px" }}
      >
        {" "}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="card-content">{item.content}</div>
          <GradientButton />
        </div>
      </Card>
    ))}
  </div>
);

export default App;
