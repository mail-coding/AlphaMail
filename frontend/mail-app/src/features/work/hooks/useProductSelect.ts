import { useCallback, useEffect } from 'react';
import { useProductSelectStore } from '../stores/productSelectStore';
import { productService } from '../services/productService';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

export const useProductSelect = () => {
  const { data: userInfo } = useUserInfo();
  const {
    products,
    searchKeyword,
    selectedId,
    isLoading,
    error,
    setProducts,
    setSearchKeyword,
    setSelectedId,
    setLoading,
    setError,
  } = useProductSelectStore();

  const fetchProducts = useCallback(async () => {
    if (!userInfo?.companyId) {
      setProducts([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await productService.searchProducts(userInfo.companyId, searchKeyword);
      setProducts(response.contents);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [userInfo?.companyId, searchKeyword, setProducts, setLoading, setError]);

  useEffect(() => {
    if (userInfo?.companyId) {
      fetchProducts();
    }
  }, [fetchProducts, userInfo?.companyId]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
  }, [setSearchKeyword]);

  const handleSelect = useCallback((id: number | null) => {
    setSelectedId(id);
  }, [setSelectedId]);

  const getSelectedProduct = useCallback(() => {
    return products.find(p => p.id === selectedId) || null;
  }, [products, selectedId]);

  return {
    products,
    searchKeyword,
    selectedId,
    isLoading,
    error,
    handleSearch,
    handleSelect,
    getSelectedProduct,
  };
}; 