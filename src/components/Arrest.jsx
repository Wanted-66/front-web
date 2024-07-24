import React, { useState } from "react";
import "./Arrest.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload, Select, Input, Button } from "antd";
import { AntDesignOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("JPG/PNG 파일만 업로드할 수 있습니다!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("이미지는 2MB보다 작아야 합니다!");
  }
  return isJpgOrPng && isLt2M;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [category, setCategory] = useState("");

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };
  const handleCategoryChange = (value) => {
    setCategory(value);
    console.log(`selected ${value}`);
  };
  const handleInputChange = (e) => {
    console.log("Change:", e.target.value);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{ marginBottom: "20px", fontSize: "40px", fontWeight: "bold" }}
      >
        어떤 수배를 검거 하실 건가요?
      </div>
      {/* 카테고리 선택 컴포넌트 */}
      <div style={{ marginBottom: "30px" }}>
        <Select
          showSearch
          placeholder="Select a category"
          optionFilterProp="label"
          onChange={handleCategoryChange}
          style={{ width: "100%" }}
        >
          <Option value="game">게임 중독</Option>
          <Option value="smoke">흡연</Option>
          <Option value="drink">술</Option>
          <Option value="drink">릴스 중독</Option>
        </Select>
      </div>
      <div
        style={{ marginBottom: "20px", fontSize: "50px", fontWeight: "bold" }}
      >
        증거사진
      </div>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div
          className="upload-container"
          style={{ width: "600px", height: "600px" }} // 크기 바꾸는법?
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            style={{ width: "100%", height: "100%" }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>
      </div>
      <div style={{ marginTop: "0px" }}>
        <TextArea
          showCount
          maxLength={100}
          onChange={handleInputChange}
          placeholder="상황 설명"
          style={{ marginTop: "0px", height: 120, resize: "none" }}
        />
      </div>
      {/* 오른쪽 정렬된 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        <Button type="primary" size="large" icon={<AntDesignOutlined />}>
          검거
        </Button>
      </div>
    </div>
  );
};

export default App;
