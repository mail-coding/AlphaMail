import React, { useEffect, useRef, useState } from 'react';

interface KakaoAddressTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (address: {
    address: string;
    zonecode: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => void;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: any) => void;
        onresize?: (size: { width: string; height: string }) => void;
        onclose?: (state: string) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
        embed: (container: HTMLElement) => void;
      };
    };
    __kakaoPostcodeOpened?: boolean;
  }
}

const KakaoAddressTemplate: React.FC<KakaoAddressTemplateProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(!!window.daum);

  useEffect(() => {
    if (window.daum) {
      setIsScriptLoaded(true);
      return;
    }
    const scriptId = 'kakao-postcode-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    } else {
      document.getElementById(scriptId)!.addEventListener('load', () => setIsScriptLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!isOpen || !isScriptLoaded) return;
    if (!window.daum || !containerRef.current) return;
    containerRef.current.innerHTML = '';

    const postcode = new window.daum.Postcode({
      oncomplete: (data) => {
        onSelect({
          address: data.address,
          zonecode: data.zonecode,
          addressType: data.addressType,
          bname: data.bname,
          buildingName: data.buildingName,
        });
        onClose();
      },
      onclose: () => {
        onClose();
      },
      width: '100%',
      height: '100%',
    });

    postcode.embed(containerRef.current);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [isOpen, isScriptLoaded, onClose, onSelect]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 오버레이 */}
      <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
      {/* 모달 */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] mx-4 p-4 flex flex-col">
        <button
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow hover:bg-gray-100"
          onClick={onClose}
          style={{ lineHeight: 1 }}
        >
          ✕
        </button>
        <div
          ref={containerRef}
          style={{ width: '100%', height: '100%' }}
          className="overflow-auto"
        />
        {!isScriptLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-20">
            <span className="text-gray-500">주소 검색기를 불러오는 중...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KakaoAddressTemplate;
