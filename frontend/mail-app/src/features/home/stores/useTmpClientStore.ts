import { create } from 'zustand';

interface TmpClientStore {
  // 거래처 기본 정보
  clientName: string;
  representative: string;
  licenseNumber: string;
  businessType: string;
  businessItem: string;
  address: string;
  managerPhone: string;
  managerEmail: string;
  businessLicense: File | null; // 사업자등록증 파일
  businessLicenseFileName: string; // 파일 이름
  
  // 액션
  setClientName: (name: string) => void;
  setRepresentative: (representative: string) => void;
  setLicenseNumber: (licenseNumber: string) => void;
  setBusinessType: (businessType: string) => void;
  setBusinessItem: (businessItem: string) => void;
  setAddress: (address: string) => void;
  setManagerPhone: (phone: string) => void;
  setManagerEmail: (email: string) => void;
  setBusinessLicense: (file: File | null) => void;
  setBusinessLicenseFileName: (fileName: string) => void;

  // 초기화
  reset: () => void;
}

export const useTmpClientStore = create<TmpClientStore>((set) => ({
  // 초기 상태
  clientName: '',
  representative: '',
  licenseNumber: '',
  businessType: '',
  businessItem: '',
  address: '',
  managerPhone: '',
  managerEmail: '',
  businessLicense: null,
  businessLicenseFileName: '',
  
  // 액션
  setClientName: (name) => set({ clientName: name }),
  setRepresentative: (representative) => set({ representative: representative }),
  setLicenseNumber: (licenseNumber) => set({ licenseNumber: licenseNumber }),
  setBusinessType: (businessType) => set({ businessType: businessType }),
  setBusinessItem: (businessItem) => set({ businessItem: businessItem }),
  setAddress: (address) => set({ address: address }),
  setManagerPhone: (phone) => set({ managerPhone: phone }),
  setManagerEmail: (email) => set({ managerEmail: email }),
  setBusinessLicense: (file) => set({ 
    businessLicense: file,
    businessLicenseFileName: file ? file.name : ''
  }),
  setBusinessLicenseFileName: (fileName) => set({ businessLicenseFileName: fileName }),

  // 초기화
  reset: () => set({
    clientName: '',
    representative: '',
    licenseNumber: '',
    businessType: '',
    businessItem: '',
    address: '',
    managerPhone: '',
    managerEmail: '',
    businessLicense: null,
    businessLicenseFileName: '',
  }),
}));