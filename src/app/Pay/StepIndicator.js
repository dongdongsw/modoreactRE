import React from 'react';
import './StepIndicator.module.css'; // CSS 모듈 import

const StepIndicator = ({ currentStep }) => {
  const steps = ['날짜 선택 단계', '결제 정보 확인 및 배송지 선택', '결제'];

  return (
    <div className= 'step-indicator'>
      {steps.map((step, index) => (
        <div key={index} className={`step ${currentStep === index ? 'active' : ''}`}>
        <div className="step-number">{index + 1}</div>
        <div className="step-label">{step}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
