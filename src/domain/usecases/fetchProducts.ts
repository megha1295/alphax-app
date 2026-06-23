import { ProductRepository } from '../repositories/ProductRepository'
import { Product } from '../entities/Product'

export async function fetchProducts(repository: ProductRepository): Promise<Product[]> {
  return repository.getProducts()
}
