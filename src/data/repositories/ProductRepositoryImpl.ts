import { ProductRepository } from '@/domain/repositories/ProductRepository'
import { Product } from '@/domain/entities/Product'
import { getProductsRequest } from '../api/productApi'

export class ProductRepositoryImpl implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    const results = await getProductsRequest()
    return results.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      rating: item.rating,
      category: item.category,
      thumbnail: item.thumbnail,
    }))
  }
}