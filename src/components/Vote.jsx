import React, { useContext, useEffect, useState } from "react";
import { Button, ConfigProvider, Space, Typography, Card } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import "./Vote.css";

const { Text } = Typography;

const Vote = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const [imageUrl, setImageUrl] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 이미지 URL을 가져옴
    const savedImageUrl = localStorage.getItem("uploadedImageUrl");
    const savedDescription = localStorage.getItem("description");
    setImageUrl(savedImageUrl);
    setDescription(savedDescription);
  }, []);

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
        // background: linear-gradient(135deg, #6253e1, #04befe);
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

  const onChange = (e) => {
    console.log("Change:", e.target.value);
  };

  return (
    <ConfigProvider
      button={{
        className: linearGradientButton,
      }}
    >
      <div className="app-container">
        <h1>검거</h1>
        <div className="content">
          <div className="image-container">
            {imageUrl ? (
              <img src={imageUrl} alt="uploaded" className="arrest-image" />
            ) : (
              <p>이미지가 없습니다.</p>
            )}
          </div>
          <div className="description-container">
            <Card
              //title="상황 설명"
              bordered={false}
              style={{
                width: "100%",
                maxWidth: 600,
                margin: "20px auto",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
              headStyle={{ padding: 0, borderBottom: "none" }} // 제목 스타일
              title={<div className="card-title">상황 설명</div>} // 제목 부분
            >
              <Text>{description || "상황 설명이 없습니다."}</Text>
            </Card>
          </div>
          <Space className="button-container">
            <Button
              type="primary"
              size="large"
              icon={<AntDesignOutlined />}
              className="vote-button-approve"
            >
              찬성
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<AntDesignOutlined />}
              className="vote-button-disapprove"
            >
              반대
            </Button>
          </Space>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Vote;
