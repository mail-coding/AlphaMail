import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// createRef 대신 일반 변수 사용 (컴포넌트 외부에서는 useRef가 아닌 일반 변수 사용)
let lastToastId: string | number | null = null;

export const showToast = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') => {
  try {
    // 이전 토스트가 있으면 안전하게 닫기
    if (lastToastId) {
      toast.dismiss(lastToastId);
      lastToastId = null; // 참조 초기화
    }
    
    // 고유한 ID 생성
    const uniqueId = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // 새 토스트 표시 및 ID 저장
    const toastId = toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      toastId: uniqueId, // 고유 ID 설정
      onClose: () => {
        // 닫힐 때 ID 참조 초기화
        if (lastToastId === toastId) {
          lastToastId = null;
        }
      }
    });
    
    lastToastId = toastId;
    return toastId; // 필요한 경우 호출자에게 ID 반환
  } catch (error) {
    console.error('토스트 표시 중 오류:', error);
    // 오류 발생 시 참조 초기화
    lastToastId = null;
  }
};

// 모든 토스트 닫기 유틸리티 함수 추가
export const dismissAllToasts = () => {
  try {
    toast.dismiss();
    lastToastId = null;
  } catch (error) {
    console.error('토스트 닫기 중 오류:', error);
  }
};

// ToastContainer를 포함한 컴포넌트
export const ToastProvider: React.FC = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};