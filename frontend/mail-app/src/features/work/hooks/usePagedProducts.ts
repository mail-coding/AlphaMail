import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService';
import { ProductResponse } from '../types/product';
import { useEffect } from 'react';
import { useProductStore } from '../stores/productStore';

interface UsePagedProductsOptions {
  companyId: number;
}

export const usePagedProducts = (options: UsePagedProductsOptions) => {
  const {
    keyword: searchQuery,
    currentPage,
    pageSize,
    sortOption,
    setCurrentPage,
  } = useProductStore();

  console.log('Hook Initialized with options:', options);
  console.log('Current state:', {
    searchQuery,
    currentPage,
    pageSize,
    sortOption
  });

  const { data, isLoading, error, refetch } = useQuery<ProductResponse>({
    queryKey: ['products', options.companyId, currentPage, pageSize, searchQuery, sortOption],
    queryFn: async () => {
      console.log('Fetching products with params:', {
        companyId: options.companyId,
        searchQuery,
        currentPage,
        pageSize,
        sortOption
      });

      const params = {
        companyId: options.companyId,
        ...(searchQuery && { query: searchQuery }),
        page: currentPage - 1,
        size: pageSize,
        sort: sortOption
      };

      console.log('Params:', params);

      try {
        const response = await productService.getProducts(params);
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
    staleTime: 30000, // 30초 동안 데이터를 신선한 상태로 유지
    enabled: true // 항상 활성화
  });

  // 검색어가 변경될 때마다 API 호출
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      console.log('검색어 변경으로 인한 API 호출:', searchQuery);
      refetch();
    }
  }, [searchQuery, refetch]);

  const handlePageChange = (page: number) => {
    console.log('Page changed:', page);
    setCurrentPage(page);
  };

  // 데이터가 없을 때 빈 배열 반환
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
