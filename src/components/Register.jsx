import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // 추가
import "./Register.css";
import {
  Steps,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Slider,
  Checkbox,
  message,
  Space,
  ConfigProvider,
  InputNumber,
} from "antd";
import { PlusOutlined, AntDesignOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Step } = Steps;

const description = "This is a description.";

// Steps component
const StepsComponent = ({ current }) => (
  <Steps current={current}>
    <Step title="기본 정보를 입력하세요." />
    <Step title="상세 정보를 입력하세요." />
    <Step title="확인 및 제출." />
  </Steps>
);

// Gradient Button component
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
// 카카오페이 결제 요청 함수
const initiateKakaoPay = async (amount) => {
  try {
    const response = await fetch("/api/kakao-pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirectUrl; // 카카오페이 결제 페이지로 리다이렉트
    } else {
      message.error(data.message || "결제 요청에 실패했습니다.");
    }
  } catch (error) {
    console.error("카카오페이 결제 요청 오류:", error);
    message.error("결제 요청 중 오류가 발생했습니다.");
  }
};
// Main App component that renders all parts
const App = () => {
  const navigate = useNavigate(); // 히스토리 객체 가져오기
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();
  const [category, setCategory] = useState("");
  // 단계별 데이터 상태
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    dateRange: [],
    location: "",
    priority: 1,
    reward: 0,
  });

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
        </Form>
      ),
    },
    {
      title: "상세 정보를 입력하세요.",
      content: (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            setFormData((prevData) => ({ ...prevData, ...changedValues }));
          }}
        >
          <Form.Item
            name="category"
            label="카테고리"
            rules={[{ required: true, message: "카테고리를 선택해주세요!" }]}
          >
            <Select
              placeholder="카테고리를 선택하세요"
              onChange={(value) => {
                setCategory(value);
                setFormData({ ...formData, category: value });
              }}
            >
              <Select.Option value="game">게임 중독</Select.Option>
              <Select.Option value="smoke">흡연</Select.Option>
              <Select.Option value="drink">음주</Select.Option>
              <Select.Option value="reels">릴스 중독</Select.Option>
              <Select.Option value="other">기타</Select.Option>
            </Select>
          </Form.Item>
          {category === "other" && (
            <Form.Item
              name="customCategory"
              label="기타 카테고리"
              rules={[{ required: true, message: "카테고리를 입력해주세요!" }]}
            >
              <Input
                placeholder="직접 카테고리를 입력하세요"
                onChange={(e) => {
                  setFormData({ ...formData, customCategory: e.target.value });
                }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="dateRange"
            label="날짜"
            rules={[{ required: true, message: "날짜를 선택해주세요!" }]}
          >
            <RangePicker />
          </Form.Item>
          <Form.Item
            name="location"
            label="위치"
            rules={[{ required: true, message: "위치를 입력해주세요!" }]}
          >
            <Input placeholder="위치를 입력하세요" />
          </Form.Item>
          <Form.Item
            name="priority"
            label="우선순위"
            rules={[{ required: true, message: "우선순위를 설정해주세요!" }]}
          >
            <Slider min={1} max={5} />
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
              action="/upload.do"
            >
              <div className="upload-button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
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
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="현상금 금액을 입력하세요"
              onChange={(value) => setFormData({ ...formData, reward: value })}
            />
          </Form.Item>
        </Form>
      ),
    },
  ];

  const next = () => {
    form
      .validateFields()
      .then(() => {
        const nextStep = current + 1;
        if (nextStep < steps.length) {
          setCurrent(nextStep);
        } else {
          // 최종 제출 시, 서버에 데이터 저장 후 페이지 이동
          // 여기에 서버로의 데이터 전송 로직을 추가하세요
          // 서버에서 성공적으로 저장되면 받은 postId로 이동
          const postId = "12345"; // 예시, 서버에서 받은 postId 사용
          navigate(`/post/${postId}`); // 해당 postId의 상세 페이지로 이동
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <div className="register-container">
      <StepsComponent current={current} />
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current > 0 && (
          <Button type="default" onClick={() => prev()}>
            이전
          </Button>
        )}
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            다음
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            선결제
          </Button>
        )}
      </div>
    </div>
  );
};

export default App;
