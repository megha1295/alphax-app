import { apiClient } from './axiosClient'

export interface ProductResponse {
  id: number
  title: string
  price: number
  rating: number
  category: string
  thumbnail: string
}

interface ProductsListResponse {
  products: ProductResponse[]
}

export async function getProductsRequest(): Promise<ProductResponse[]> {
  const response = await apiClient.get<ProductsListResponse>('/products')
  return response.data.products
}