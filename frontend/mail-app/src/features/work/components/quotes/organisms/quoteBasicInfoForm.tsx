import React from 'react';
import { QuoteDetail } from '../../../types/quote';

interface QuoteBasicInfoFormProps {
  formData: QuoteDetail;
  onInputChange: (field: keyof QuoteDetail, value: string | Date) => void;
}

export const QuoteBasicInfoForm: React.FC<QuoteBasicInfoFormProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">견적번호</label>
          <input
            type="text"
            value={formData.quoteNo}
            onChange={(e) => onInputChange('quoteNo', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">일자</label>
          <input
            type="date"
            value={formData.createdAt.toISOString().split('T')[0]}
            onChange={(e) => onInputChange('createdAt', new Date(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">담당자</label>
          <input
            type="text"
            value={formData.manager}
            onChange={(e) => onInputChange('manager', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">거래처명</label>
          <input
            type="text"
            value={formData.clientName}
            onChange={(e) => onInputChange('clientName', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
          <input
            type="text"
            value={formData.licenseNumber}
            onChange={(e) => onInputChange('licenseNumber', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">종목</label>
          <input
            type="text"
            value={formData.businessItem}
            onChange={(e) => onInputChange('businessItem', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">업태</label>
          <input
            type="text"
            value={formData.businessType}
            onChange={(e) => onInputChange('businessType', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">거래처담당자</label>
          <input
            type="text"
            value={formData.manager}
            onChange={(e) => onInputChange('manager', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">거래처연락처</label>
          <input
            type="text"
            value={formData.managerNumber}
            onChange={(e) => onInputChange('managerNumber', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="col-span-3">
          <label className="block text-sm font-medium text-gray-700">주소</label>
          <input
            type="text"
            value={formData.shippingAddress}
            onChange={(e) => onInputChange('shippingAddress', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}; 