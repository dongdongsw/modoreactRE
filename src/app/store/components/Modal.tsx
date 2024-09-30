import React from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart } from "@phosphor-icons/react"; // 쇼핑백 아이콘 가져오기

interface ModalProps {
  isVisible: boolean; // 모달 표시 여부
  message: string; // 모달에 표시할 메시지
  onClose: () => void; // 모달 닫기 함수
  onNavigate: () => void; // 페이지 이동 함수
}

const Modal: React.FC<ModalProps> = ({ isVisible, message, onClose, onNavigate }) => {
  if (!isVisible) return null; // 모달이 표시되지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modalh3">
        <h3>장바구니에 담았습니다!</h3>
        <ShoppingCart size={100} />
          
          <h3>쇼핑을 계속 하시겠습니까?</h3>
        </div>
        <div className="button-group">
          <button onClick={onNavigate}>결제하러가기</button>
          <button onClick={onClose}>이어서 쇼핑</button>
        </div>
      </div>

      {/* 모달창 스타일링 */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          width: 400px;
          text-align: center;
        }

        .modalh3 {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
        }

        button {
          margin-top: 10px;
          padding: 10px 20px;
          background: #000;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background 0.3s ease;
          width: 150px;
        }

        button:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
};

export default Modal;
