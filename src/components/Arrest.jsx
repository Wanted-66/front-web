import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Arrest.css";
import {
  LoadingOutlined,
  PlusOutlined,
  AntDesignOutlined,
} from "@ant-design/icons";
import { message, Upload, Input, Button } from "antd";

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
    return Upload.LIST_IGNORE;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("이미지는 2MB보다 작아야 합니다!");
    return Upload.LIST_IGNORE;
  }
  return isJpgOrPng && isLt2M;
};

const Arrest = ({ userName }) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

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
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = () => {
    if (imageUrl) {
      localStorage.setItem("uploadedImageUrl", imageUrl);
      navigate("/vote");
    } else {
      message.error("이미지를 업로드해 주세요.");
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div className="arrest-container">
      <div className="arrest-content">
        <div className="sub-header">{userName} 제보하기</div>
        <div
          className="upload-section"
          style={{ width: "300px", height: "300px", margin: "0 auto" }}
        >
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            customRequest={({ file, onSuccess, onError }) => {
              // simulate an upload
              setTimeout(() => {
                getBase64(file, (url) => {
                  setImageUrl(url);
                  setLoading(false);
                  onSuccess();
                });
              }, 0);
            }}
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
        <div className="description">
          <TextArea
            showCount
            maxLength={100}
            placeholder="상황 설명"
            style={{ height: 120, resize: "none" }}
          />
        </div>
        <div className="submit-button">
          <Button
            type="primary"
            size="large"
            icon={<AntDesignOutlined />}
            onClick={handleSubmit}
          >
            검거
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Arrest;
