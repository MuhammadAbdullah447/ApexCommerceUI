import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../services/api/productsApi';
import { mapApiProductToProduct, ApiProduct } from '../types/product';

const DEFAULT_STALE_TIME = 1000 * 60 * 5; // 5 minutes

export const useProducts = (params?: { limit?: number; skip?: number }) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const data = await productsApi.getProducts(params);
      const mappedProducts = data.products.map(mapApiProductToProduct);
      return {
        ...data,
        mappedProducts,
      };
    },
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useProductDetails = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) return null;
      const apiProduct = await productsApi.getProductById(id);
      const product = mapApiProductToProduct(apiProduct);
      return {
        apiProduct,
        product,
      };
    },
    enabled: Boolean(id),
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await productsApi.getCategories();
      return categories;
    },
    staleTime: 1000 * 60 * 60, // 1 hour for static categories
  });
};

export const useCategoryProducts = (
  categorySlug: string | null | undefined,
  params?: { limit?: number; skip?: number }
) => {
  const isValid = Boolean(
    categorySlug &&
      categorySlug.toLowerCase() !== 'all' &&
      categorySlug.toLowerCase() !== 'all products'
  );

  return useQuery({
    queryKey: ['category-products', categorySlug, params],
    queryFn: async () => {
      if (!categorySlug || !isValid) return null;
      const data = await productsApi.getProductsByCategory(categorySlug, params);
      const mappedProducts = data.products.map(mapApiProductToProduct);
      return {
        ...data,
        mappedProducts,
      };
    },
    enabled: isValid,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useSearchProducts = (query: string) => {
  const trimmed = query.trim();
  return useQuery({
    queryKey: ['products-search', trimmed],
    queryFn: async () => {
      if (!trimmed) return null;
      const data = await productsApi.searchProducts(trimmed);
      const mappedProducts = data.products.map(mapApiProductToProduct);
      return {
        ...data,
        mappedProducts,
      };
    },
    enabled: trimmed.length > 0,
    staleTime: DEFAULT_STALE_TIME,
  });
};

export const useAddProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productData: Partial<ApiProduct>) => productsApi.addProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, productData }: { id: string | number; productData: Partial<ApiProduct> }) =>
      productsApi.updateProduct(id, productData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', String(variables.id)] });
    },
  });
};

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
