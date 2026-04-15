import React from 'react';
import { OrderProduct } from '../../../types/order';
import { Product } from '../../../types/product';
import ProductInput from '../../../../../shared/components/atoms/productInput';
import { Typography } from '../../../../../shared/components/atoms/Typography';

interface OrderProductRowProps {
  index: number;
  product: OrderProduct;
  onProductChange: (index: number, field: keyof OrderProduct, value: string | number) => void;
  onRemoveProduct: (index: number) => void;
  onProductSelect: (product: Product) => void;
}

const OrderProductRow: React.FC<OrderProductRowProps> = ({
  index,
  product,
  onProductChange,
  onRemoveProduct,
  onProductSelect,
}) => {
  // 자동 계산
  const taxAmount = Math.floor((product.count || 0) * (product.price || 0) * 0.1);
  const supplyAmount = Math.floor((product.count || 0) * (product.price || 0) * 1.1);

  // 입력 필드에 적용할 공통 클래스
  const inputClassCommon = "font-pretendard text-xs text-[14px]";

  return (
    <tr className="font-pretendard text-[14px]">
      <td className="pl-3 border border-[#E5E5E5] bg-white text-center align-middle h-[40px] w-[40px]">
        <button
          type="button"
          onClick={() => onRemoveProduct(index)}
          className="w-6 h-6 pb-0.5 bg-[#FAFAFA] rounded-md flex items-center justify-center"
          aria-label="행 삭제"
        >
          <Typography variant="body" className="text-gray-500 font-bold text-[14px]">－</Typography>
        </button>
      </td>
      <td className="border border-[#E5E5E5] bg-white text-center align-middle h-[40px] w-[40px] font-pretendard">
        <Typography variant="body" className="text-xs text-[14px]">
          {index + 1}
        </Typography>
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <ProductInput
          value={product.name}
          onChange={onProductSelect}
          className={`w-full h-[32px] px-2 border border-gray-300 bg-white focus:outline-none ${inputClassCommon}`}
        />
      </td>
      <td className="border text-center border-[#E5E5E5] bg-white px-2 font-pretendard">
        <Typography variant="body" className="text-xs text-[14px]">{product.standard}</Typography>
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <input 
          type="number" 
          value={product.count} 
          onChange={e => onProductChange(index, 'count', Number(e.target.value))} 
          className={`w-full h-[32px] px-2 border border-gray-300 bg-white text-right focus:outline-none ${inputClassCommon}`}
          min={0}
        />
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <div className="flex items-center">
          <input 
            type="number" 
            value={product.price} 
            onChange={e => onProductChange(index, 'price', Number(e.target.value))} 
            className={`w-full h-[32px] px-2 border border-gray-300 bg-white text-right focus:outline-none ${inputClassCommon}`}
            min={0}
          />
          <Typography variant="body" className="ml-1 text-gray-500 whitespace-nowrap text-xs text-[14px]">원</Typography>
        </div>
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <div className="flex items-center justify-end">
          <Typography variant="body" className="text-gray-500 whitespace-nowrap text-xs text-[14px]">{taxAmount.toLocaleString()}원</Typography>
        </div>
      </td>
      <td className="border border-[#E5E5E5] bg-white px-2">
        <div className="flex items-center justify-end">
          <Typography variant="body" className="text-gray-500 whitespace-nowrap text-xs text-[14px]">{supplyAmount.toLocaleString()}원</Typography>
        </div>
      </td>
    </tr>
  );
};

export default OrderProductRow;