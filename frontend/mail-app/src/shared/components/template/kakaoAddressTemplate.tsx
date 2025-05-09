import React, { useEffect } from 'react';

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
      };
    };
  }
}

const KakaoAddressTemplate: React.FC<KakaoAddressTemplateProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  useEffect(() => {
    // 카카오 우편번호 스크립트 동적 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isOpen && window.daum) {
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

      postcode.open();

      // 컴포넌트가 언마운트되거나 isOpen이 false로 변경될 때 정리
      return () => {
        onClose();
      };
    }
  }, [isOpen, onClose, onSelect]);

  return null;
};

export default KakaoAddressTemplate;
