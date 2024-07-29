import React, { useContext, useEffect, useState } from "react";
import { Button, ConfigProvider, Space, Input } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import "./Vote.css";

const { TextArea } = Input;

const Vote = () => {
  const { getPrefixCls } = useContext(ConfigProvider.ConfigContext);
  const rootPrefixCls = getPrefixCls();
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // 로컬 스토리지에서 이미지 URL을 가져옴
    const savedImageUrl = localStorage.getItem("uploadedImageUrl");
    setImageUrl(savedImageUrl);
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
            <TextArea
              showCount
              maxLength={100}
              onChange={onChange}
              placeholder="상황설명"
              style={{ width: "70%", height: 120, resize: "none" }}
            />
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
