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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { AppContext } from "../AppContext";
import SignatureCanvas from "./SignatureCanvas"; // 서명 컴포넌트 임포트
import { css } from "@emotion/css";
import { ConfigProvider } from "antd";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

// Steps component
const StepsComponent = ({ current }) => (
  <Steps current={current}>
    <Step title="기본 정보를 입력하세요." />
    <Step title="확인 및 제출." />
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
  const { addPost } = useContext(AppContext);
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
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
  });
  const [signatureVisible, setSignatureVisible] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const [isSignatureCompleted, setIsSignatureCompleted] = useState(false);

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    const reader = new FileReader();

    reader.onload = (e) => {
      setImage(e.target.result); // Base64 형식으로 이미지 저장
      setFormData((prevData) => ({
        ...prevData,
        image: e.target.result, // formData에 이미지 데이터 저장
      }));
    };

    reader.readAsDataURL(file);
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
            <Input placeholder="다짐을 입력하세요" />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "확인 및 제출.",
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
              {image ? (
                <img src={image} alt="avatar" style={{ width: "100%" }} />
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
              onChange={(value) => {
                setFormData((prevData) => ({
                  ...prevData,
                  reward: value,
                }));
              }}
            />
          </Form.Item>
        </Form>
      ),
    },
  ];

  const prev = () => {
    setCurrent(current - 1);
  };

  const next = () => {
    if (current === steps.length - 1) {
      if (!isSignatureCompleted) {
        message.error("서명을 완료해야 제출할 수 있습니다.");
        return;
      }
    }

    form
      .validateFields()
      .then(() => {
        const nextStep = current + 1;
        if (nextStep < steps.length) {
          setCurrent(nextStep);
        } else {
          addPost(formData); // formData 전체를 등록
          navigate("/List"); // 리스트 페이지로 이동
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleSignature = () => {
    setSignatureVisible(true);
  };

  const handleSignatureSave = (dataURL) => {
    setSignatureData(dataURL);
    setIsSignatureCompleted(true); // 서명 완료 상태 업데이트
    message.success("서명이 저장되었습니다!");
  };

  return (
    <div className="register-container">
      <StepsComponent current={current} />
      <div className="steps-content">{steps[current].content}</div>
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
          <>
            <GradientButton onClick={handleSignature}>서명하기</GradientButton>
            <Button
              type="primary"
              onClick={next}
              disabled={!isSignatureCompleted && current === steps.length - 1}
            >
              제출
            </Button>
          </>
        )}
      </div>

      {/* 서명 모달 */}
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
