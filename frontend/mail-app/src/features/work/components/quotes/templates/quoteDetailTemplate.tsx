import React, { useState } from 'react';
import { QuoteDetail, QuoteProduct, CreateQuoteRequest, UpdateQuoteRequest } from '../../../types/quote';
import { QuoteBasicInfoForm } from '../organisms/quoteBasicInfoForm';
import { QuoteProductTable } from '../organisms/quoteProductTable';
import { useQuote } from '../../../hooks/useQuote';

interface QuoteDetailTemplateProps {
  quote?: QuoteDetail;
  onBack: () => void;
  onSave: () => void;
}

export const QuoteDetailTemplate: React.FC<QuoteDetailTemplateProps> = ({
  quote,
  onBack,
  onSave,
}) => {
  const { handleCreateQuote, handleUpdateQuote } = useQuote();
  const [formData, setFormData] = useState<QuoteDetail>(
    quote || {
      quote_no: '',
      order_no: '',
      date: new Date().toISOString().split('T')[0],
      client_name: '',
      business_no: '',
      representative: '',
      business_type: '',
      business_category: '',
      manager: '',
      client_manager: '',
      client_contact: '',
      payment_condition: '',
      delivery_date: '',
      address: '',
      products: [
        {
          name: '',
          standard: '',
          quantity: 0,
          unit_price: 0,
          tax_amount: 0,
          supply_amount: 0,
          amount: 0,
        },
      ],
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (index: number, field: keyof QuoteProduct, value: string | number) => {
    setFormData((prev) => {
      const newProducts = [...prev.products];
      newProducts[index] = {
        ...newProducts[index],
        [field]: value,
      };
      
      // 수량이나 단가가 변경되면 금액 자동 계산
      if (field === 'quantity' || field === 'unit_price') {
        newProducts[index].amount = 
          newProducts[index].quantity * newProducts[index].unit_price;
      }
      
      return {
        ...prev,
        products: newProducts,
      };
    });
  };

  const addProduct = () => {
    setFormData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          name: '',
          standard: '',
          quantity: 0,
          unit_price: 0,
          tax_amount: 0,
          supply_amount: 0,
          amount: 0,
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (quote) {
        // Update existing quote
        const updateData: UpdateQuoteRequest = {
          id: Number(quote.quote_no),
          ...formData,
        };
        await handleUpdateQuote(updateData);
      } else {
        // Create new quote
        const createData: CreateQuoteRequest = {
          ...formData,
        };
        await handleCreateQuote(createData);
      }
      onSave();
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
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          뒤로가기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <QuoteBasicInfoForm
          formData={formData}
          onInputChange={handleInputChange}
        />

        <QuoteProductTable
          products={formData.products}
          onProductChange={handleProductChange}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
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
    </div>
  );
}; 