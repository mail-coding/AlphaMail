import { useSidebarStore } from '@/shared/stores/useSidebarStore';
import { Typography } from '@/shared/components/atoms/Typography';
import { ProductManagementTemplate } from '@/features/work/components/products/templates/productManagementTemplate';
import { ProductDetailTemplate } from '@/features/work/components/products/templates/productDetailTemplate';
import { useState, useEffect } from 'react';
import { Product } from '@/features/work/types/product';

const WorkPage = () => {
  const { activeItem } = useSidebarStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);

  // activeItem이 변경될 때 상세 화면 상태 초기화
  useEffect(() => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  }, [activeItem]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowProductDetail(true);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleBack = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  const renderTemplate = () => {
    switch (activeItem) {
      case '거래처 관리':
        return <div className="p-4">거래처 관리 템플릿</div>;
      case '발주서 관리':
        return <div className="p-4">발주서 관리 템플릿</div>;
      case '재고 관리':
        return showProductDetail ? (
          <ProductDetailTemplate 
            product={selectedProduct || undefined}
            onBack={handleBack}
          />
        ) : (
          <ProductManagementTemplate 
            onAddProduct={handleAddProduct}
            onProductClick={handleProductClick}
          />
        );
      case '견적서 관리':
        return <div className="p-4">견적서 관리 템플릿</div>;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <Typography variant="titleMedium" color="text-gray-500">
              템플릿을 선택해주세요
            </Typography>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      <div className="p-4">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default WorkPage;
