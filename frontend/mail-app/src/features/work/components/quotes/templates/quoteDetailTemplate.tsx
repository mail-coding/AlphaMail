import React, { useEffect, useRef, useState } from 'react';
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
import { TooltipPortal } from '@/shared/components/atoms/TooltipPortal';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/shared/components/atoms/toast';

export const QuoteDetailTemplate = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { formData, setFormData } = useQuoteStore();
  const { data: userInfo } = useUserInfo();
  const { data: quote, isLoading } = useQuoteDetail(id ? parseInt(id) : null);
  const { handleCreateQuote, handleUpdateQuote } = useQuotes({});
  const queryClient = useQueryClient();

  const clientNameRef = useRef<HTMLInputElement>(null!);
  const managerNumberRef = useRef<HTMLInputElement>(null!);
  const shippingAddressRef = useRef<HTMLInputElement>(null!);

  const [tooltip, setTooltip] = useState<{
    key: string;
    message: string;
    position: { top: number; left: number };
  } | null>(null);

  const [isDataReady, setIsDataReady] = useState(false);

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
      setFormData(() => quote);
    }
  }, [id, quote, setFormData]);

  useEffect(() => {
    if (formData && !isLoading) {
      const isValid = Boolean(
        formData.quoteNo && 
        formData.products && 
        formData.products.length > 0 &&
        formData.products.every(product => 
          product && 
          product.name && 
          typeof product.count === 'number' && 
          typeof product.price === 'number'
        )
      );
      setIsDataReady(isValid);
    } else {
      setIsDataReady(false);
    }
  }, [formData, isLoading]);

  useEffect(() => {
    if (formData) {
      console.log("formData updated:", formData);
    }
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userInfo) return showToast('사용자 정보를 찾을 수 없습니다.', 'error');
      if (!formData) return showToast('견적서 데이터가 없습니다.', 'error');
      if (!formData.products || formData.products.length === 0)
        return showToast('최소 1개의 품목을 추가해야 합니다.', 'error');

      if (!formData.clientName || formData.clientName.trim() === '') {
        const rect = clientNameRef.current?.getBoundingClientRect();
        if (rect) setTooltip({ key: 'clientName', message: '거래처명을 입력해주세요.', position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 } });
        return;
      }

      const phoneRegex = /^((010-\d{4}-\d{4})|(01[1|6|7|8|9]-\d{3,4}-\d{4})|(0[2-9]{1,2}-\d{3,4}-\d{4}))$/;
      if (formData.managerNumber && !phoneRegex.test(formData.managerNumber)) {
        const rect = managerNumberRef.current?.getBoundingClientRect();
        if (rect) setTooltip({ key: 'managerNumber', message: '거래처 연락처 형식이 올바르지 않습니다.', position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 } });
        return;
      }

      if (!formData.shippingAddress || formData.shippingAddress.trim() === '') {
        const rect = shippingAddressRef.current?.getBoundingClientRect();
        if (rect) setTooltip({ key: 'shippingAddress', message: '주소를 입력해주세요.', position: { top: rect.top + window.scrollY, left: rect.left + window.scrollX + rect.width / 2 } });
        return;
      }

      const MAX_PRODUCT_COUNT = 2000000000;
      const MAX_PRODUCT_PRICE = 9223372036854775807;

      for (let i = 0; i < formData.products.length; i++) {
        const product = formData.products[i];
        const productNameForAlert = product.name || `품목 ${i + 1}`;

        if (!product.name) return showToast(`품목 ${i + 1}의 이름을 입력해주세요.`, 'error');
        if (typeof product.count !== 'number' || product.count < 0)
          return showToast(`${productNameForAlert}의 수량은 0 이상의 숫자로 입력해주세요.`, 'error');
        if (product.count > MAX_PRODUCT_COUNT)
          return showToast(`${productNameForAlert}의 수량은 ${MAX_PRODUCT_COUNT.toLocaleString()}을 초과할 수 없습니다.`, 'error');

        if (typeof product.price !== 'number' || product.price < 0)
          return showToast(`${productNameForAlert}의 단가는 0 이상의 숫자로 입력해주세요.`, 'error');
        if (product.price > MAX_PRODUCT_PRICE)
          return showToast(`${productNameForAlert}의 단가는 ${MAX_PRODUCT_PRICE.toLocaleString()}을 초과할 수 없습니다.`, 'error');
      }

      if (id && id !== 'new') {
        await handleUpdateQuote(formData);
        await queryClient.invalidateQueries({ queryKey: ['quotes'] });
        await queryClient.invalidateQueries({ queryKey: ['quoteDetail', formData.id] });
        showToast('견적서가 성공적으로 수정되었습니다.', 'success');
      } else {
        await handleCreateQuote(formData);
        await queryClient.invalidateQueries({ queryKey: ['quotes'] });
        showToast('견적서가 성공적으로 등록되었습니다.', 'success');
      }
      navigate('/work/quotes', { replace: true });
    } catch (error) {
      console.error('Failed to save quote:', error);
      showToast('견적서 저장에 실패했습니다.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" />
      </div>
    );
  }

  const showPdfButton = id && id !== 'new' && isDataReady;

  return (
    <div className="p-8 bg-white rounded shadow max-w-5xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Typography variant="titleSmall">
          견적서 {id && id !== 'new' ? '수정' : '등록'}
        </Typography>
        <div className="flex space-x-2">
          <div className="min-w-[110px] h-[40px]">
            {showPdfButton && <PdfButton quoteDetail={formData} />}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <QuoteBasicInfoForm
          clientNameRef={clientNameRef}
          managerNumberRef={managerNumberRef}
          shippingAddressRef={shippingAddressRef}
          onInputFocus={() => setTooltip(null)}
        />
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
          <Button type="submit" variant="primary" size="small">
            <Typography variant="titleSmall" className="text-white">
              {id && id !== 'new' ? '수정' : '등록'}
            </Typography>
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
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center font-pretendard text-sm "
        >
          ← 목록으로
        </button>
      </div>

      {tooltip && (
        <TooltipPortal position={tooltip.position}>
          <div className="bg-red-500 text-white text-xs rounded px-3 py-1 relative shadow" style={{ transform: 'translateX(-50%) translateY(-100%)' }}>
            {tooltip.message}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-500" />
          </div>
        </TooltipPortal>
      )}
    </div>
  );
};

export default QuoteDetailTemplate;
