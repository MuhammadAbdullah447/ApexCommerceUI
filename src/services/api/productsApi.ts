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

  addProduct: async (productData: Partial<ApiProduct>): Promise<ApiProduct> => {
    const response = await apiClient.post<ApiProduct>('/products/add', productData);
    return response.data;
  },

  updateProduct: async (id: string | number, productData: Partial<ApiProduct>): Promise<ApiProduct> => {
    const response = await apiClient.put<ApiProduct>(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string | number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> => {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(`/products/${id}`);
    return response.data;
  },
};
