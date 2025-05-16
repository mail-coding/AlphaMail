import React, { useEffect } from 'react';
import { QuoteDetail } from '../../../types/quote';
import { QuoteProductTable } from '../organisms/quoteProductTable';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useQuotes } from '../../../hooks/useQuote';
import { Client } from '../../../types/clients';
import { Product } from '@/features/work/types/product';
import ClientInput from '@/shared/components/atoms/clientInput';
import AddressInput from '@/shared/components/atoms/addressInput';
import KakaoAddressTemplate from '@/shared/components/template/kakaoAddressTemplate';
import { api } from '@/shared/lib/axiosInstance';
import { PdfButton } from './quoteDocumentTemplate';

interface QuoteDetailTemplateProps {
  quote: QuoteDetail | null;
  onBack: () => void;
  onSave: (quoteData: QuoteDetail) => void;
}

export const QuoteDetailTemplate: React.FC<QuoteDetailTemplateProps> = ({
  quote,
  onBack,
  onSave,
}) => {
  const { data: userInfo } = useUserInfo();
  const { handleCreateQuote, handleUpdateQuote } = useQuotes({});
  const [isAddressModalOpen, setIsAddressModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<QuoteDetail>(
    quote || {
      id: 0,
      userId: 0,
      userName: '',
      groupId: 0,
      groupName: '',
      clientId: 0,
      clientName: '',
      manager: '',
      managerNumber: '',
      licenseNumber: '',
      businessType: '',
      businessItem: '',
      shippingAddress: '',
      quoteNo: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      representative: '',
      products: [
        {
          id: 0,
          name: '',
          standard: '',
          count: 0,
          price: 0,
          deletedAt: null,
        },
      ],
    }
  );

  useEffect(() => {
    if (quote) {
      setFormData(quote);
    }
  }, [quote]);

  const handleClientChange = async (client: Client) => {
    try {
      const response = await api.get(`/api/erp/clients/${client.id}`);
      const clientDetail = response.data;

      setFormData(prev => ({
        ...prev,
        clientId: client.id,
        clientName: clientDetail.corpName,
        licenseNumber: clientDetail.licenseNum,
        representative: clientDetail.representative,
        businessType: clientDetail.businessType || '',
        businessItem: clientDetail.businessItem || '',
        manager: clientDetail.manager || '',
        managerNumber: clientDetail.managerPhone || '',
        shippingAddress: clientDetail.address || '',
      }));
    } catch (error) {
      console.error('거래처 정보 조회 실패:', error);
      alert('거래처 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleAddressChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: value,
    }));
  };

  const handleAddressSelect = (data: {
    address: string;
    zonecode: string;
    addressType: string;
    bname: string;
    buildingName: string;
  }) => {
    handleAddressChange(data.address);
    setIsAddressModalOpen(false);
  };

  const handleProductSelect = (product: Product) => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: product.id,
          name: product.name,
          standard: product.standard,
          count: 1,
          price: product.outboundPrice,
          deletedAt: null,
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!userInfo) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      if (quote) {
        await handleUpdateQuote(formData);
      } else {
        await handleCreateQuote(formData);
      }
      onSave(formData);
    } catch (error) {
      console.error('Failed to save quote:', error);
      alert('견적서 저장에 실패했습니다.');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {quote ? '견적서 수정' : '견적서 등록'}
        </h2>
        <div className="flex space-x-2">
          {quote && <PdfButton data={formData} />}
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            뒤로가기
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">견적번호</label>
              <input
                type="text"
                name="quoteNo"
                value={formData.quoteNo}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">일자</label>
              <input
                type="date"
                name="createdAt"
                value={formData.createdAt.toISOString().split('T')[0]}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: new Date(value),
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">담당자</label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">거래처</label>
              <ClientInput
                value={formData.clientName}
                onChange={handleClientChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">사업자등록번호</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">대표자</label>
              <input
                type="text"
                name="representative"
                value={formData.representative}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">업태</label>
              <input
                type="text"
                name="businessType"
                value={formData.businessType}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">종목</label>
              <input
                type="text"
                name="businessItem"
                value={formData.businessItem}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">거래처담당자</label>
              <input
                type="text"
                name="manager"
                value={formData.manager}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">거래처연락처</label>
              <input
                type="text"
                name="managerNumber"
                value={formData.managerNumber}
                onChange={(e) => {
                  const { name, value } = e.target;
                  setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                  }));
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">주소</label>
              <AddressInput
                value={formData.shippingAddress}
                onChange={handleAddressChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <QuoteProductTable
          products={formData.products}
          onProductChange={(index, field, value) => {
            setFormData((prev) => {
              const newProducts = [...prev.products];
              newProducts[index] = {
                ...newProducts[index],
                [field]: value,
              };
              return {
                ...prev,
                products: newProducts,
              };
            });
          }}
          onAddProduct={() => {
            setFormData((prev) => ({
              ...prev,
              products: [
                ...prev.products,
                {
                  id: 0,
                  name: '',
                  standard: '',
                  count: 0,
                  price: 0,
                  deletedAt: null,
                },
              ],
            }));
          }}
          onRemoveProduct={(index) => {
            setFormData((prev) => ({
              ...prev,
              products: prev.products.filter((_, i) => i !== index),
            }));
          }}
          availableProducts={[]}
          onProductSelect={handleProductSelect}
        />

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {quote ? '수정' : '저장'}
          </button>
        </div>
      </form>

      <KakaoAddressTemplate
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelect={handleAddressSelect}
      />
    </div>
  );
}; 