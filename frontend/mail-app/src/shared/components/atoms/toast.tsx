import { toast } from "react-toastify";
import { createRef } from "react";

const lastToastIdRef = createRef<string | number | null>();

export const showToast = (message: string, type: 'error' | 'warning' | 'info' | 'success' = 'error') => {

    // 이전 토스트가 있으면 닫기
    if (lastToastIdRef.current) {
      toast.dismiss(lastToastIdRef.current);
    }
    
    // 새 토스트 표시 및 ID 저장
    const toastId = toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    lastToastIdRef.current = toastId;
  };