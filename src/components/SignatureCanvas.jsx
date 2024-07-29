// src/components/SignatureCanvas.jsx
import React, { useRef, useState } from "react";
import { Modal, Button } from "antd";

const SignatureCanvas = ({ visible, onClose, onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    const context = canvasRef.current.getContext("2d");
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const context = canvasRef.current.getContext("2d");
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clear = () => {
    const context = canvasRef.current.getContext("2d");
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const save = () => {
    const dataURL = canvasRef.current.toDataURL("image/png");
    onSave(dataURL);
    onClose();
  };

  return (
    <Modal
      title="서명하기"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="clear" onClick={clear}>
          지우기
        </Button>,
        <Button key="save" type="primary" onClick={save}>
          저장
        </Button>,
      ]}
      width={600}
    >
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{ border: "1px solid black" }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
      />
    </Modal>
  );
};

export default SignatureCanvas;
