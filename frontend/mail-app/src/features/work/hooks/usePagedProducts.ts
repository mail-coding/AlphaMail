import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService';
import { ProductResponse } from '../types/product';
import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';
import { useUserInfo } from '@/shared/hooks/useUserInfo';

export const usePagedProducts = () => {
  const { data: userInfo } = useUserInfo();
  const companyId = userInfo?.companyId;

  const {
    keyword: searchQuery,
    currentPage,
    pageSize,
    sortOption,
    setCurrentPage,
  } = useProductStore();

  console.log('Current state:', {
    searchQuery,
    currentPage,
    pageSize,
    sortOption,
    companyId
  });

  const { data, isLoading, error, refetch } = useQuery<ProductResponse>({
    queryKey: ['products', companyId, currentPage, pageSize, searchQuery, sortOption],
    queryFn: async () => {
      if (!companyId) {
        console.warn('Company ID is not available, skipping API call.');
        return { contents: [], totalCount: 0, pageCount: 0, currentPage: 1 };
      }
      console.log('Fetching products with params:', {
        companyId,
        searchQuery,
        currentPage,
        pageSize,
        sortOption
      });

      const params = {
        ...(searchQuery && { query: searchQuery }),
        page: currentPage - 1,
        size: pageSize,
        sort: sortOption
      };

      console.log('Params for getProducts (first arg):', params);
      console.log('Company ID for getProducts (second arg):', companyId);

      try {
        const response = await productService.getProducts(params, companyId);
        console.log('API Response:', response);
        console.log('Response items:', response.contents);
        console.log('Response items type:', typeof response.contents);
        console.log('Response items is array:', Array.isArray(response.contents));
        return response;
      } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
    },
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
    enabled: !!companyId
  });

  useEffect(() => {
    if (companyId && searchQuery.trim() !== '') {
      console.log('검색어 변경으로 인한 API 호출:', searchQuery);
      refetch();
    }
  }, [searchQuery, refetch, companyId]);

  const handlePageChange = (page: number) => {
    console.log('Page changed:', page);
    setCurrentPage(page);
  };

  const products = data?.contents || [];

  return {
    products,
    totalCount: data?.totalCount || 0,
    pageCount: data?.pageCount || 0,
    currentPage,
    pageSize,
    sortOption,
    searchQuery,
    isLoading,
    error,
    handlePageChange,
    refetch
  };
};
