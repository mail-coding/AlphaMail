import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSidebarStore } from '@/shared/stores/useSidebarStore';
import { useHeaderStore } from '@/shared/stores/useHeaderStore';
import { Routes, Route } from 'react-router-dom';

// Work 관련 템플릿 컴포넌트들
import { ClientManagementTemplate } from '@/features/work/components/clients/templates/clientManagementTemplate';
import { ClientDetailTemplate } from '@/features/work/components/clients/templates/clientDetailTemplate';
import OrderManagementTemplate from '@/features/work/components/orders/templates/orderManagementTemplate';
import OrderDetailTemplate from '@/features/work/components/orders/templates/orderDetailTemplate';
import { ProductManagementTemplate } from '@/features/work/components/products/templates/productManagementTemplate';
import { ProductDetailTemplate } from '@/features/work/components/products/templates/productDetailTemplate';
import { QuoteManagementTemplate } from '@/features/work/components/quotes/templates/quoteManagementTemplate';
import { QuoteDetailTemplate } from '@/features/work/components/quotes/templates/quoteDetailTemplate';

// 각 템플릿을 감싸는 래퍼 컴포넌트들
const ClientManagementWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();

  React.useEffect(() => {
    setActiveItem("거래처 관리");
    setTitle("거래처 관리");
  }, [setActiveItem, setTitle]);

  return <ClientManagementTemplate />;
};

const ClientDetailWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();
  const { id } = useParams();

  React.useEffect(() => {
    setActiveItem("거래처 관리");
    setTitle(id === 'new' ? "거래처 등록" : "거래처 수정");
  }, [setActiveItem, setTitle, id]);

  return <ClientDetailTemplate onCancel={() => navigate(-1)} />;
};

const OrderManagementWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();

  React.useEffect(() => {
    setActiveItem("발주서 관리");
    setTitle("발주서 관리");
  }, [setActiveItem, setTitle]);

  return <OrderManagementTemplate />;
};

const OrderDetailWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    setActiveItem("발주서 관리");
    setTitle("발주서 관리");
  }, [setActiveItem, setTitle]);

  return (
    <OrderDetailTemplate 
      order={null}
      onBack={() => navigate('/work/orders', { replace: true })}
      onSave={() => navigate('/work/orders', { replace: true })}
    />
  );
};

const ProductManagementWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();

  React.useEffect(() => {
    setActiveItem("재고 관리");
    setTitle("재고 관리");
  }, [setActiveItem, setTitle]);

  return <ProductManagementTemplate />;
};

const ProductDetailWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();

  React.useEffect(() => {
    setActiveItem("재고 관리");
    setTitle("재고 관리");
  }, [setActiveItem, setTitle]);

  return <ProductDetailTemplate />;
};

const QuoteManagementWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();

  React.useEffect(() => {
    setActiveItem("견적서 관리");
    setTitle("견적서 관리");
  }, [setActiveItem, setTitle]);

  return <QuoteManagementTemplate />;
};

const QuoteDetailWrapper = () => {
  const { setActiveItem } = useSidebarStore();
  const { setTitle } = useHeaderStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    setActiveItem("견적서 관리");
    setTitle("견적서 관리");
  }, [setActiveItem, setTitle]);

  return (
    <QuoteDetailTemplate 
      quote={null}
      onBack={() => navigate('/work/quotes', { replace: true })}
      onSave={() => navigate('/work/quotes', { replace: true })}
    />
  );
};

const WorkPage: React.FC = () => {
  return (
    <div className="h-full">
      <div className="p-4">
        <Routes>
          {/* Clients Routes */}
          <Route path="clients" element={<ClientManagementWrapper />} />
          <Route path="clients/new" element={<ClientDetailWrapper />} />
          <Route path="clients/:id" element={<ClientDetailWrapper />} />
          
          {/* Orders Routes */}
          <Route path="orders" element={<OrderManagementWrapper />} />
          <Route path="orders/:id" element={<OrderDetailWrapper />} />
          
          {/* Products Routes */}
          <Route path="products" element={<ProductManagementWrapper />} />
          <Route path="products/:id" element={<ProductDetailWrapper />} />
          
          {/* Quotes Routes */}
          <Route path="quotes" element={<QuoteManagementWrapper />} />
          <Route path="quotes/:id" element={<QuoteDetailWrapper />} />
        </Routes>
      </div>
    </div>
  );
};

export default WorkPage;
