import React from 'react';
import './NextStepButton.css'; // 일반 CSS 파일 import

const NextStepButton = ({ onNext }) => {
  return (
    <div className="nextStepButton"> {/* className에 문자열로 클래스 이름 적용 */}
      <button onClick={onNext} className="button">다음 단계</button> {/* 마찬가지로 문자열로 적용 */}
    </div>
  );
};

export default NextStepButton;
