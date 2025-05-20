import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuoteProductTable } from '../organisms/quoteProductTable';
import { useUserInfo } from '@/shared/hooks/useUserInfo';
import { useQuotes } from '../../../hooks/useQuote';
import { Product } from '@/features/work/types/product';
import { PdfButton } from './quoteDocumentTemplate';
import { Button } from '@/shared/components/atoms/button';
import { Typography } from '@/shared/components/atoms/Typography';
import { Spinner } from '@/shared/components/atoms/spinner';
import { useQuoteStore } from '../../../stores/quoteStore';
import { useQuoteDetail } from '../../../hooks/useQuoteDetail';
import QuoteBasicInfoForm from '../organisms/quoteBasicInfoForm';

export const QuoteDetailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { formData, setFormData } = useQuoteStore();
  const { data: userInfo } = useUserInfo();
  const { data: quote, isLoading } = useQuoteDetail(id ? parseInt(id) : null);
  const { handleCreateQuote, handleUpdateQuote } = useQuotes({});

  useEffect(() => {
    if (id === 'new') {
      setFormData({
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
        products: [],
      });
    } else if (quote) {
      setFormData(quote);
    }
  }, [id, quote, setFormData]);

  const MAX_LENGTHS = {
    quoteNo: 255,
    shippingAddress: 255,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userInfo) {
        alert('사용자 정보를 찾을 수 없습니다.');
        return;
      }

      if (!formData) {
        alert('견적서 데이터가 없습니다.');
        return;
      }

      // 유효성 검사
      if (!formData.quoteNo) {
        alert('견적등록번호를 입력해주세요.');
        return;
      }
      if (formData.quoteNo.length > MAX_LENGTHS.quoteNo) {
        alert(`견적등록번호는 ${MAX_LENGTHS.quoteNo}자까지 입력 가능합니다.`);
        return;
      }

      if (!formData.createdAt) {
        alert('일자를 입력해주세요.'); // HTML input type="date"는 기본적으로 값을 가지거나 빈 문자열임
        return;
      }

      if (!formData.clientName) {
        alert('거래처명을 입력해주세요.');
        return;
      }

      if (!formData.shippingAddress) {
        alert('주소를 입력해주세요.');
        return;
      }
      if (formData.shippingAddress.length > MAX_LENGTHS.shippingAddress) {
        alert(`주소는 ${MAX_LENGTHS.shippingAddress}자까지 입력 가능합니다.`);
        return;
      }

      // 각 제품에 대한 유효성 검사
      const MAX_PRODUCT_COUNT = 2000000000;
      const MAX_PRODUCT_PRICE = 9223372036854775807;

      for (let i = 0; i < formData.products.length; i++) {
        const product = formData.products[i];
        const productNameForAlert = product.name || `품목 ${i + 1}`;

        // 품목 이름 유효성 검사
        if (!product.name) {
          alert(`품목 ${i + 1}의 이름을 입력해주세요.`);
          return;
        }

        // 수량 유효성 검사
        if (typeof product.count !== 'number' || product.count < 0) {
          alert(`${productNameForAlert}의 수량은 0 이상의 숫자로 입력해주세요.`);
          return;
        }
        if (product.count > MAX_PRODUCT_COUNT) {
          alert(`${productNameForAlert}의 수량은 ${MAX_PRODUCT_COUNT.toLocaleString()}을 초과할 수 없습니다.`);
          return;
        }

        // 단가 유효성 검사
        if (typeof product.price !== 'number' || product.price < 0) {
          alert(`${productNameForAlert}의 단가는 0 이상의 숫자로 입력해주세요.`);
          return;
        }
        if (product.price > MAX_PRODUCT_PRICE) {
          alert(`${productNameForAlert}의 단가는 ${MAX_PRODUCT_PRICE.toLocaleString()}을 초과할 수 없습니다.`);
          return;
        }
      }

      if (id && id !== 'new') {
        await handleUpdateQuote(formData);
      } else {
        await handleCreateQuote(formData);
      }
      navigate('/work/quotes');
    } catch (error) {
      console.error('Failed to save quote:', error);
      alert('견적서 저장에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const showPdfButton = id && id !== 'new' && formData && formData.quoteNo && formData.products && formData.products.length > 0;

  return (
    <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Typography variant="titleSmall">
          견적서 {id && id !== 'new' ? '수정' : '등록'}
        </Typography>
        <div className="flex space-x-2">
          {showPdfButton && <PdfButton data={formData} />}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <QuoteBasicInfoForm />
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
          onProductSelect={(product: Product) => {
            setFormData((prev) => ({
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
          }}
        />

        <div className="flex justify-end space-x-2 mt-8">
        <Button
            type="submit"
            variant="primary"
            size="small"
          >
            <Typography variant="titleSmall" className="text-white">{id && id !== 'new' ? '수정' : '등록'}</Typography>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="small"
            onClick={() => navigate('/work/quotes')}
          >
            <Typography variant="titleSmall" className="text-white">취소</Typography>
          </Button>
        </div>
      </form>

      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={() => navigate('/work/quotes')}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default QuoteDetailTemplate; 