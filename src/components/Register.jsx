import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  InputNumber,
  message,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import SignatureCanvas from "./SignatureCanvas";
import { css } from "@emotion/css";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const StepsComponent = ({ current }) => (
  <Steps current={current}>
    <Step title="기본 정보를 입력하세요." />
    <Step title="확인 및 서명." />
    <Step title="미리보기" />
  </Steps>
);

const GradientButton = ({ onClick, children }) => {
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
    <Button
      className={linearGradientButton}
      type="primary"
      size="large"
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const Register = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [category, setCategory] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    dateRange: [],
    location: "",
    priority: 1,
    reward: 0,
    comment: "",
    signature: null,
    name: "홍길동",
  });
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [isSignatureCompleted, setIsSignatureCompleted] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    console.log("Uploaded file:", file);

    setMainImage(URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
      mainImage: file,
    }));
    setIsImageUploaded(true);
  };

  const handleSignatureSave = (dataURL) => {
    setFormData((prevData) => ({
      ...prevData,
      signature: dataURL,
    }));
    setIsSignatureCompleted(true);
    setSignatureVisible(false);
    message.success("서명이 저장되었습니다!");
  };

  const fetchWantedStatus = async (email) => {
    try {
      const response = await fetch(
        `https://wanted66.r-e.kr/api/wanted/is-progress/${email}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      return data; // assuming data is a boolean indicating whether a wanted is in progress
    } catch (error) {
      console.error("Error fetching wanted status:", error);
      message.error(`상태 조회 중 오류가 발생했습니다: ${error.message}`);
      return null;
    }
  };

  const updateWantedStatus = async (wantedId, newStatus) => {
    try {
      const response = await fetch(
        `https://wanted66.r-e.kr/api/wanted/${wantedId}/${newStatus}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        if (errorText.includes("이미 wanted가 진행중입니다")) {
          message.error(
            "한 사람당 하나의 글만 올릴 수 있습니다. 글을 삭제한 후 등록해주세요."
          );
        } else {
          message.error(`상태 변경 중 오류가 발생했습니다: ${errorText}`);
        }
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Status updated successfully:", data);
    } catch (error) {
      console.error("Error updating status:", error);
      message.error(`상태 변경 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const handleSubmit = async () => {
    // 이미지와 다짐이 formData에 제대로 저장되어 있는지 확인
    console.log("FormData before submission:", formData);
    const userEmail = "user@naver.com"; // Replace with dynamic user email as needed
    const isProgress = await fetchWantedStatus(userEmail);

    if (isProgress) {
      message.error(
        "현재 진행 중인 wanted가 있습니다. 새로운 wanted를 등록하려면 기존 wanted를 먼저 종료하세요."
      );
      return;
    }
    if (!isSignatureCompleted) {
      message.error("서명을 완료해야 제출할 수 있습니다.");
      return;
    }

    setLoading(true);

    const jsonData = {
      title: formData.title,
      description: formData.description,
      prize: formData.reward,
      promise: formData.comment,
      category:
        formData.category === "기타"
          ? formData.customCategory
          : formData.category,
      startDate: formData.dateRange[0],
      endDate: formData.dateRange[1],
      userEmail: "user@naver.com",
    };

    const formDataToSubmit = new FormData();
    formDataToSubmit.append(
      "dto",
      new Blob([JSON.stringify(jsonData)], { type: "application/json" })
    );

    if (formData.mainImage) {
      formDataToSubmit.append("main", formData.mainImage);
    }

    if (formData.signature) {
      formDataToSubmit.append(
        "signature",
        dataURLtoFile(formData.signature, "signature.png")
      );
    }
    console.log("FormData contents:");
    for (let pair of formDataToSubmit.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("https://wanted66.r-e.kr/api/wanted/image", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        message.error(`제출 중 오류가 발생했습니다: ${errorText}`);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Success:", data);
      console.log("Comment before submission:", formData.comment);

      // 서버 응답에서 이미지 URL 추출 및 상태 업데이트
      if (data.imageUrl) {
        setMainImage(data.imageUrl);
        setFormData((prevData) => ({
          ...prevData,
          mainImage: data.imageUrl,
        }));
      }
      // 사용자 이메일을 URL 파라미터로 전달하여 List 페이지로 이동
      navigate(`/List/${"user@naver.com"}`); // 현재 사용자의 이메일로 수정해야 함

      const wantedId = data.wantedId;
      const status = await fetchWantedStatus(wantedId);
      setCurrentStatus(status);

      if (status !== "PROGRESS") {
        await updateWantedStatus(wantedId, "SUCCESS");
      } else {
        message.error("수배 항목이 이미 진행중입니다.");
      }
      navigate("/List");
    } catch (error) {
      console.error("Error:", error);
      message.error(`제출 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    if (current === 1) {
      if (!isImageUploaded) {
        message.error("표지 사진을 업로드해야 다음 단계로 넘어갈 수 있습니다.");
        return;
      }
      if (!isSignatureCompleted) {
        message.error("서명을 완료해야 다음 단계로 넘어갈 수 있습니다.");
        return;
      }
    }

    if (current === steps.length - 1) {
      handleSubmit();
    } else {
      form
        .validateFields()
        .then(() => {
          setCurrent(current + 1);
        })
        .catch((info) => {
          console.log("Validate Failed:", info);
        });
    }
  };

  const handleSignature = () => {
    setSignatureVisible(true);
  };

  const dataURLtoFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const steps = [
    {
      title: "기본 정보를 입력하세요.",
      content: (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormData((prevData) => ({ ...prevData, ...changedValues }));
          }}
        >
          <Form.Item
            name="title"
            label="제목"
            rules={[{ required: true, message: "제목을 입력해주세요!" }]}
          >
            <Input placeholder="수배 제목을 입력하세요" />
          </Form.Item>
          <Form.Item
            name="description"
            label="설명"
            rules={[{ required: true, message: "설명을 입력해주세요!" }]}
          >
            <TextArea
              rows={4}
              placeholder="수배에 대한 상세 설명을 입력하세요"
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="카테고리"
            rules={[{ required: true, message: "카테고리를 선택해주세요!" }]}
          >
            <Select
              placeholder="카테고리를 선택하세요"
              onChange={(value) => {
                setCategory(value);
                setFormData((prevData) => ({ ...prevData, category: value }));
              }}
            >
              <Select.Option value="게임 중독">게임 중독</Select.Option>
              <Select.Option value="흡연">흡연</Select.Option>
              <Select.Option value="음주">음주</Select.Option>
              <Select.Option value="릴스 중독">릴스 중독</Select.Option>
              <Select.Option value="기타">기타</Select.Option>
            </Select>
          </Form.Item>
          {category === "기타" && (
            <Form.Item
              name="customCategory"
              label="기타 카테고리"
              rules={[{ required: true, message: "카테고리를 입력해주세요!" }]}
            >
              <Input
                placeholder="직접 카테고리를 입력하세요"
                onChange={(e) => {
                  setFormData((prevData) => ({
                    ...prevData,
                    customCategory: e.target.value,
                  }));
                }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="dateRange"
            label="날짜"
            rules={[{ required: true, message: "날짜를 선택해주세요!" }]}
          >
            <RangePicker
              onChange={(dates, dateStrings) => {
                setFormData((prevData) => ({
                  ...prevData,
                  dateRange: dateStrings,
                }));
              }}
            />
          </Form.Item>
          <Form.Item
            name="comment"
            label="다짐 한마디"
            rules={[{ required: true, message: "다짐을 입력해주세요!" }]}
          >
            <Input
              placeholder="다짐을 입력하세요"
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  comment: e.target.value,
                }));
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "확인 및 서명.",
      content: (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormData((prevData) => ({ ...prevData, ...changedValues }));
          }}
        >
          <Form.Item name="upload" label="표지 사진">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              onChange={handleImageUpload}
            >
              {mainImage ? (
                <img src={mainImage} alt="avatar" style={{ width: "100%" }} />
              ) : (
                <div className="upload-button">
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="reward"
            label="현상금"
            rules={[{ required: true, message: "현상금을 입력해주세요!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="현상금을 입력하세요"
              formatter={(value) => {
                if (!value) return "";
                return `₩ ${value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
              }}
              parser={(value) => value.replace(/₩\s?|(,*)/g, "")}
              onChange={(value) => {
                setFormData((prevData) => ({
                  ...prevData,
                  reward: value,
                }));
              }}
            />
          </Form.Item>
          <GradientButton onClick={handleSignature}>서명하기</GradientButton>
        </Form>
      ),
    },
    {
      title: "미리보기",
      content: (
        <div className="post-detail-container">
          <div className="post-header">
            <h1 className="post-title">{formData.title}</h1>
          </div>
          {mainImage && (
            <img src={mainImage} alt="표지 사진" className="post-image" />
          )}
          <div className="post-info">
            <p>
              <strong>작성자:</strong> {formData.name}
            </p>
            <p>
              <strong>설명:</strong> {formData.description}
            </p>
            <p>
              <strong>카테고리:</strong>{" "}
              {formData.category === "기타"
                ? formData.customCategory
                : formData.category}
            </p>
            <p>
              <strong>날짜:</strong> {formData.dateRange.join(" ~ ")}
            </p>
            <p>
              <strong>다짐 한마디:</strong> {formData.comment}
            </p>
            <p>
              <strong>현상금:</strong> {formData.reward.toLocaleString()} 원
            </p>
          </div>
          {formData.signature && (
            <div className="signature-preview">
              <h2>서명</h2>
              <img
                src={formData.signature}
                alt="서명"
                className="post-signature"
              />
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="register-container">
      <StepsComponent current={current} />
      <div className="steps-content">
        {loading ? <Spin size="large" /> : steps[current].content}
      </div>
      <div className="steps-action">
        {current > 0 && (
          <Button type="default" onClick={prev}>
            이전
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            다음
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={next}
            disabled={!isSignatureCompleted && current === steps.length - 1}
          >
            제출
          </Button>
        )}
      </div>

      {signatureVisible && (
        <SignatureCanvas
          visible={signatureVisible}
          onClose={() => setSignatureVisible(false)}
          onSave={handleSignatureSave}
        />
      )}
    </div>
  );
};

export default Register;
