import { useCallback, useEffect, useState } from 'react';
import { useProductSelectStore } from '../stores/productSelectStore';
import { productService } from '../services/productService';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

export const useProductSelect = () => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { data: userInfo } = useUserInfo();

  const fetchProducts = useCallback(async () => {
    if (!userInfo?.companyId) {
      setProducts([]);
      return;
    }
    
    try {
      setLoading(true);
      const response = await productService.getProducts({
        query: searchKeyword,
        page: currentPage - 1,
        size: pageSize,
      }, userInfo.companyId);
      setProducts(response.contents);
      setTotalCount(response.totalCount);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [userInfo?.companyId, searchKeyword, currentPage, pageSize, setProducts, setLoading, setError]);

  useEffect(() => {
    if (userInfo?.companyId) {
      fetchProducts();
    }
  }, [fetchProducts, userInfo?.companyId]);

  const handleSearch = useCallback((keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(1);
    setSelectedId(null);
  }, [setSearchKeyword, setSelectedId]);

  const handleSelect = useCallback((id: number | null) => {
    setSelectedId(id);
  }, [setSelectedId]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    setSelectedId(null);
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
    currentPage,
    pageCount: Math.ceil(totalCount / pageSize),
    handleSearch,
    handleSelect,
    handlePageChange,
    getSelectedProduct,
  };
}; 