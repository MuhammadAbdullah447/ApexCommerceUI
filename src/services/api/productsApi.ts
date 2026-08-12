import { apiClient } from './client';
import { ApiProduct, ProductsResponse, Category } from '../../types/product';

export const productsApi = {
  getProducts: async (params?: { limit?: number; skip?: number }): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products', {
      params: {
        limit: params?.limit ?? 30,
        skip: params?.skip ?? 0,
      },
    });
    return response.data;
  },

  getProductById: async (id: string | number): Promise<ApiProduct> => {
    const response = await apiClient.get<ApiProduct>(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/products/categories');
    return response.data;
  },

  getProductsByCategory: async (
    categorySlug: string,
    params?: { limit?: number; skip?: number }
  ): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>(
      `/products/category/${encodeURIComponent(categorySlug)}`,
      {
        params: {
          limit: params?.limit ?? 30,
          skip: params?.skip ?? 0,
        },
      }
    );
    return response.data;
  },

  searchProducts: async (query: string): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>('/products/search', {
      params: { q: query },
    });
    return response.data;
  },
};
