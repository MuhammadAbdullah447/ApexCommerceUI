export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  images: string[];
  thumbnail: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
}

export interface ProductsResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviewCount?: number;
  category: string;
  inStock: boolean;
  imageUri: string;
  description?: string;
  images?: string[];
  collection?: string;
}

export const mapApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const formattedCategory = apiProduct.category
    ? apiProduct.category.charAt(0).toUpperCase() + apiProduct.category.slice(1).replace(/-/g, ' ')
    : 'General';

  return {
    id: String(apiProduct.id),
    title: apiProduct.title,
    price: apiProduct.price,
    rating: Number((apiProduct.rating || 4.5).toFixed(1)),
    reviewCount: apiProduct.reviews?.length ? apiProduct.reviews.length * 18 + 7 : 42,
    category: formattedCategory,
    inStock: apiProduct.stock > 0,
    imageUri: apiProduct.thumbnail || (apiProduct.images && apiProduct.images[0]) || '',
    description: apiProduct.description,
    images: apiProduct.images && apiProduct.images.length > 0 ? apiProduct.images : [apiProduct.thumbnail],
  };
};
