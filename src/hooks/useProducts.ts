import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/api/productsApi';
import { mapApiProductToProduct, Product, Category } from '../types/product';

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
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const categories = await productsApi.getCategories();
      return categories;
    },
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
  });
};
