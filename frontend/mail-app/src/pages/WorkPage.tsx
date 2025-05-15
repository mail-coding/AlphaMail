import { useSidebarStore } from '@/shared/stores/useSidebarStore';
import { Typography } from '@/shared/components/atoms/Typography';
import { ProductManagementTemplate } from '@/features/work/components/products/templates/productManagementTemplate';
import { ProductDetailTemplate } from '@/features/work/components/products/templates/productDetailTemplate';
import { QuoteManagementTemplate } from '@/features/work/components/quotes/templates/quoteManagementTemplate';
import { QuoteDetailTemplate } from '@/features/work/components/quotes/templates/quoteDetailTemplate';
import { ClientManagementTemplate } from '@/features/work/components/clients/templates/clientManagementTemplate';
import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/features/work/types/product';
import { QuoteDetail } from '@/features/work/types/quote';
import OrderManagementTemplate from '@/features/work/components/orders/templates/orderManagementTemplate';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { productService } from '@/features/work/services/productService';
import { quoteService } from '@/features/work/services/quoteService';

const sectionToTitle: Record<string, string> = {
  'clients': '거래처 관리',
  'orders': '발주서 관리',
  'products': '재고 관리',
  'quotes': '견적서 관리'
};

const WorkPage = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<QuoteDetail | null>(null);

  // activeItem과 title 설정을 위한 콜백 함수
  const updateActiveItemAndTitle = useCallback(() => {
    const path = location.pathname;
    
    // 기본 경로
    if (path === '/work') {
      setTitle('업무 관리');
      setActiveItem('업무 관리');
      return;
    }

    // 섹션 경로 처리
    const section = path.split('/')[2];
    if (section) {
      const title = sectionToTitle[section];
      if (title) {
        setTitle(title);
        setActiveItem(title);
      }
    }

    // 상세 페이지 경로 처리
    if (path.includes('/products/') && id) {
      setTitle('재고 상세');
      setActiveItem('재고 관리');
    } else if (path.includes('/quotes/') && id) {
      setTitle('견적서 상세');
      setActiveItem('견적서 관리');
    }
  }, [location.pathname, id, setTitle, setActiveItem]);

  // URL 경로에 따라 적절한 타이틀과 activeItem 설정
  useEffect(() => {
    updateActiveItemAndTitle();
  }, [updateActiveItemAndTitle]);

  // 상세 데이터 로드
  useEffect(() => {
    const loadDetail = async () => {
      if (!id) return;

      const path = location.pathname;
      if (path.includes('/products/')) {
        try {
          const product = await productService.getProduct(id);
          setSelectedProduct(product);
        } catch (error) {
          console.error('상품 상세 정보 로드 실패:', error);
          navigate('/work/products');
        }
      } else if (path.includes('/quotes/')) {
        try {
          const quote = await quoteService.getQuoteById(Number(id));
          setSelectedQuote(quote);
        } catch (error) {
          console.error('견적서 상세 정보 로드 실패:', error);
          navigate('/work/quotes');
        }
      }
    };

    loadDetail();
  }, [id, location.pathname, navigate]);

  const handleAddProduct = () => {
    navigate('/work/products/new');
  };

  const handleAddQuote = () => {
    navigate('/work/quotes/new');
  };

  const handleQuoteClick = (quote: QuoteDetail) => {
    setSelectedQuote(quote);
    navigate(`/work/quotes/${quote.id}`);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    navigate(`/work/products/${product.id}`);
  };

  const handleBack = () => {
    const path = location.pathname;
    const section = path.split('/')[2];
    if (section) {
      navigate(`/work/${section}`);
    } else {
      navigate('/work');
    }
  };

  const renderTemplate = () => {
    const path = location.pathname;
    const section = path.split('/')[2];

    // 상세 템플릿
    if (path.includes('/products/') && id) {
      return (
        <ProductDetailTemplate 
          product={selectedProduct || undefined}
          onBack={handleBack}
        />
      );
    }

    if (path.includes('/quotes/') && id) {
      return (
        <QuoteDetailTemplate 
          quote={selectedQuote || null}
          onBack={handleBack}
          onSave={handleBack}
        />
      );
    }

    // 기본 템플릿
    switch (section) {
      case 'clients':
        return <ClientManagementTemplate />;
      case 'orders':
        return <OrderManagementTemplate />;
      case 'products':
        return <ProductManagementTemplate onAddProduct={handleAddProduct} onProductClick={handleProductClick} />;
      case 'quotes':
        return <QuoteManagementTemplate onAddQuote={handleAddQuote} onQuoteClick={handleQuoteClick} />;
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
