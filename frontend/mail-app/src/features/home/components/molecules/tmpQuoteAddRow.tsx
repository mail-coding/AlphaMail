import React, { useEffect, useMemo, useState } from 'react';
import { Typography } from '@/shared/components/atoms/Typography';
import { Input } from '@/shared/components/atoms/input';
import { useTmpQuoteStore } from '../../stores/useTmpQuoteStore';
import ProductInput from '@/shared/components/atoms/productInput';
import { Product } from '@/features/work/types/product';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa';

interface TmpQuoteAddRowProps {
  showValidationErrors?: boolean;
}

// 품목 아이템 인터페이스
interface OrderItem {
  id: number;
  name: string;
  spec: string;
  quantity: string;
  price: string;
  tax: string;
  total: string;
  maxStock?: number; 
}

export const TmpQuoteAddRow: React.FC<TmpQuoteAddRowProps> = ({ showValidationErrors = false }) => {
  // 로컬 상태로 품목 관리
  const [items, setItems] = useState<OrderItem[]>([]);
  const { products, setProducts } = useTmpQuoteStore();
  const productsString = useMemo(() => JSON.stringify(products), [products]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // products 배열이 변경될 때 items 상태 업데이트
  useEffect(() => {
    if (products && products.length > 0) {
      // products 배열을 items 형식으로 변환
      const newItems = products.map((product, index) => ({
        id: index + 1,
        name: product.productName || '',
        spec: product.standard || '',
        quantity: product.count?.toString() || '0',
        price: (product.price || 0).toLocaleString(),
        tax: Math.round((product.price || 0) * (product.count || 0) * 0.1).toLocaleString(),
        total: ((product.price || 0) * (product.count || 0)).toLocaleString(),
        maxStock: product.maxStock
      }));
      
      setItems(newItems);
    } else if (items.length === 0) {
      // 초기 상태에 빈 아이템 하나 추가
      setItems([{
        id: 1,
        name: '',
        spec: '',
        quantity: '0',
        price: '',
        tax: '',
        total: ''
      }]);
    }
  }, [productsString]);
  
  // 품목 추가
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    setItems([...items, {
      id: newId,
      name: '',
      spec: '',
      quantity: '0',
      price: '',
      tax: '',
      total: ''
    }]);
  };
  
  // 품목 삭제
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    
    // 선택된 제품 목록에서도 제거
    const itemToRemove = items.find(item => item.id === id);
    if (itemToRemove) {
      setSelectedProducts(prev => prev.filter(p => p.name !== itemToRemove.name));
    }
    
    // 스토어에서도 제거
    const updatedItems = items.filter(item => item.id !== id);
    updateProductsStore(updatedItems);
  };
  
  const updateProductsStore = (updatedItems: OrderItem[]) => {
    // 스토어에 저장할 제품 목록 생성
    const storeProducts = updatedItems.map(item => {
      // 품목 검색으로 선택된 제품인지 확인
      const selectedProduct = selectedProducts.find(p => p.name === item.name);
      
      // 기존 products 배열에서 해당 아이템의 productId 찾기
      const existingProduct = products.find(p => p.id === item.id);
      
      return {
        id: item.id,
        // 1. 품목 검색으로 선택된 경우 해당 제품의 id를 사용
        // 2. 그렇지 않고 기존 products에 productId가 있으면 그것을 사용
        // 3. 둘 다 없으면 null
        productId: selectedProduct ? selectedProduct.id : (existingProduct?.productId || null),
        productName: item.name,
        standard: item.spec,
        price: parseInt(item.price.replace(/,/g, '')) || 0,
        count: parseInt(item.quantity) || 0,
        maxStock: item.maxStock
      };
    });
      
    // 스토어 업데이트
    setProducts(storeProducts);
  };

  // 품목명 설정 (제품 검색 후 선택 시 호출)
  const setItemName = (id: number, product: Product) => {
    // 선택된 제품 정보 저장
    setSelectedProducts(prev => {
      const filtered = prev.filter(p => 
        !items.some(item => item.id === id && item.name === p.name)
      );
      return [...filtered, product];
    });
    
    const quantity = '0';
    
    // 가격 설정 (outboundPrice가 0이면 inboundPrice 사용)
    const price = product.outboundPrice || product.inboundPrice || 0;
    const count = parseInt(quantity) || 1;
    
    // 공급가액 계산 (단가 × 수량)
    const supplyAmount = price * count;
    
    // 세액 계산 (공급가액의 10%)
    const taxAmount = Math.round(supplyAmount * 0.1);
        
    const updatedItems = items.map(item => 
      item.id === id ? {
        ...item,
        name: product.name || '',
        spec: product.standard || '',
        quantity: quantity,
        price: price.toLocaleString(),
        tax: taxAmount.toLocaleString(),
        total: supplyAmount.toLocaleString(),
        maxStock: product.stock // 최대 재고 수량 저장
      } : item
    );
    
    setItems(updatedItems);
    
    // 스토어 업데이트 시 productId 포함하여 업데이트
    const storeProducts = updatedItems.map(item => {
      return {
        id: item.id,
        // 현재 선택한 품목인 경우 product.id를 productId로 설정
        productId: item.id === id ? product.id : null,
        productName: item.name,
        standard: item.spec,
        price: parseInt(item.price.replace(/,/g, '')) || 0,
        count: parseInt(item.quantity) || 0,
        maxStock: item.id === id ? product.stock : item.maxStock
      };
    });
    
    setProducts(storeProducts);
  };

  // 품목 선택 처리
  const handleProductSelect = (id: number, product: Product) => {
    console.log('handleProductSelect 호출됨:', id, product);

    // 품목 정보 설정
    setItemName(id, product);
  }  

  // 수량 변경 처리
  const handleQuantityChange = (id: number, value: string) => {
    // 숫자만 입력 가능하도록
    if (!/^\d*$/.test(value)) return;
    
    // 현재 아이템 찾기
    const currentItem = items.find(item => item.id === id);
    if (!currentItem) return;

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
  
    
    // 최대 재고 수량 체크
    const maxStock = currentItem.maxStock;
    const numValue = parseInt(value) || 0;
    
    // 재고 수량 초과 시 최대값으로 제한
    if (maxStock !== undefined && numValue > maxStock) {
      value = maxStock.toString();
      toast.error(`최대 주문 가능 수량은 ${maxStock}개입니다.`);
    }
  
    // 가격 문자열에서 숫자로 변환 (콤마 제거)
    const price = Number(currentItem.price.replace(/,/g, ''));
    const quantity = Number(value);
    
    // 공급가액 계산 (단가 × 수량)
    const supplyAmount = price * quantity;
    
    // 세액 계산 (공급가액의 10%)
    const taxAmount = Math.round(supplyAmount * 0.1);
    
    // 로컬 상태 업데이트
    const updatedItems = items.map(item => 
      item.id === id ? {
        ...item,
        quantity: value,
        tax: taxAmount.toLocaleString(),
        total: supplyAmount.toLocaleString()
      } : item
    );
    
    setItems(updatedItems);
    // 스토어 직접 업데이트 - productId 유지
    if (itemIndex < products.length) {
      const storeProducts = [...products];
      storeProducts[itemIndex] = {
        ...storeProducts[itemIndex],
        count: parseInt(value) || 0
      };
      
      setProducts(storeProducts);
    }
      
  }
      
  // 총액 계산
  const getTotalAmount = () => {
    return items.reduce((sum, item) => {
      const total = parseInt(item.total.replace(/,/g, '')) || 0;
      return sum + total;
    }, 0);
  };

  // 품목 검증 상태 확인
  const hasProductValidationError = showValidationErrors && (
    products.length === 0 || 
    products.some(product => !product.productId)
  );

  const CustomProductInput = ({ item }: { item: OrderItem }) => {
    
    return (
      <div className="relative">
        <ProductInput
          value={item.name}
          onChange={(product) => handleProductSelect(item.id, product)}
          placeholder="품목 검색"
          className={`w-full !h-7 !text-sm !rounded-none pl-8`}
        />
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500">
          <FaSearch size={14} />
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Typography variant="titleSmall" className="font-medium">
            품목
          </Typography>
          {hasProductValidationError && (
            <span className="text-red-500 text-xs ml-2">
              {products.length === 0 
                ? '* 최소 1개 이상의 품목이 필요합니다' 
                : '* 모든 품목은 검색을 통해 등록해야 합니다'}
            </span>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border-y border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-t border-b border-gray-300 p-2 w-12 text-center">
                <button 
                  onClick={addItem}
                  className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 w-16 text-center">
                <Typography variant="caption" className="text-gray-700">순번</Typography>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">품목</Typography>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">규격</Typography>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">수량</Typography>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">단가</Typography>
              </th>
              <th className="border-t border-b border-x border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">세액</Typography>
              </th>
              <th className="border-t border-b border-gray-300 p-2 text-center">
                <Typography variant="caption" className="text-gray-700">공급가액</Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border-b border-gray-300 p-2 text-center">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                  >
                    -
                  </button>
                </td>
                <td className="border-b border-x border-gray-300 p-2 text-center">
                  <Typography variant="body">{item.id}</Typography>
                </td>
                <td className="border-b border-x border-gray-300 p-2">
                  <CustomProductInput item={item} />
                </td>
                <td className="border-b border-x border-gray-300 p-2">
                  <Input
                    value={item.spec}
                    readOnly
                    className="bg-gray-200 h-10"
                  />
                </td>
                <td className="border-b border-x border-gray-300 p-2">
                  <Input
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    placeholder=""
                    className="h-10"
                  />
                </td>
                <td className="border-b border-x border-gray-300 p-2">
                  <Input
                    value={item.price}
                    readOnly
                    className="bg-gray-200 text-right h-10"
                  />
                </td>
                <td className="border-b border-x border-gray-300 p-2">
                  <Input
                    value={item.tax}
                    readOnly
                    className="bg-gray-200 text-right h-10"
                  />
                </td>
                <td className="border-b border-gray-300 p-2">
                  <Input
                    value={item.total}
                    readOnly
                    className="bg-gray-200 text-right h-10"
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100">
              <td colSpan={7} className="border-b border-x border-gray-300 p-2 text-right">
                <Typography variant="body" className="font-bold">합계</Typography>
              </td>
              <td className="border-b border-gray-300 p-2 text-right">
                <Typography variant="body" className="font-bold">{getTotalAmount().toLocaleString()} 원</Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};