import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [imageFile, setImageFile] = useState(null);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { wantedId } = useParams(); // URL에서 wantedId를 가져옴

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setImageFile(info.file.originFileObj);
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
      });
    } else if (info.file.status === "error") {
      setLoading(false);
      message.error("이미지 업로드에 실패했습니다.");
    }
  };

  const handleSubmit = async () => {
    if (imageFile && description.trim()) {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("userEmail", userName);
      formData.append("image", imageFile);

      console.log("Form Data: ", formData);
      console.log("wantedId: ", wantedId);
      // FormData 내용 확인
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      try {
        const response = await fetch(
          `https://wanted66.r-e.kr/api/wanted/${wantedId}/report`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server Error:", errorData);
          throw new Error(`Error: ${errorData.description}`);
        }

        const data = await response.json();
        message.success("제보가 성공적으로 제출되었습니다.");
        navigate("/vote");
      } catch (err) {
        console.error("Failed to submit report:", err);
        message.error("제보 제출에 실패했습니다.");
      }
    } else {
      message.error("이미지와 상황설명을 모두 입력해 주세요.");
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
              setTimeout(() => {
                getBase64(file, (url) => {
                  setImageFile(file);
                  setLoading(false);
                  onSuccess();
                });
              }, 0);
            }}
            style={{ width: "100%", height: "100%" }}
          >
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
