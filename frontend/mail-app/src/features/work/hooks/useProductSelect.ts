import { useCallback, useEffect } from 'react';
import { useProductSelectStore } from '../stores/productSelectStore';
import { productService } from '../services/productService';
import { useCompany } from './useCompany';

export const useProductSelect = () => {
  const { companyId } = useCompany();
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
    if (!companyId) return;
    
    try {
      setLoading(true);
      const response = await productService.searchProducts(companyId, searchKeyword);
      setProducts(response.contents);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [companyId, searchKeyword, setProducts, setLoading, setError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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