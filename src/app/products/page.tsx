'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Navbar from '@/presentation/components/Navbar'
import { ProductRepositoryImpl } from '@/data/repositories/ProductRepositoryImpl'
import { fetchProducts } from '@/domain/usecases/fetchProducts'
import { Product } from '@/domain/entities/Product'
import { useCartStore } from '@/presentation/store/cartStore'
import Trash from '@/presentation/components/icons/Trash'

const productRepository = new ProductRepositoryImpl()
function renderStars(rating: number) {
  const fullStars = Math.round(rating)
  return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars)
}
 
export default function ProductsPage() {
  const addItem = useCartStore((state) => state.addItem)
  const items = useCartStore((state) => state.items)
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProducts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await fetchProducts(productRepository)
      setProducts(result)
    } catch (err) {
      setError('Could not load products, please try again')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products"
            className="w-full max-w-sm mb-6 px-3 py-2 border border-border-strong rounded-md bg-white text-ink"
          />

          {isLoading && <p className="text-sm text-muted">Loading products...</p>}

          {error && (
            <div className="text-center py-12">
              <p className="text-sm text-danger mb-4">{error}</p>
              <button
                onClick={loadProducts}
                className="bg-accent text-white font-medium px-5 py-2 rounded-md"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !error && filteredProducts.length === 0 && (
            <p className="text-sm text-muted">No products match your search</p>
          )}

          {!isLoading && !error && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-surface border border-border rounded-lg p-3"
                >
                  <div className="relative w-full h-28 mb-2 bg-background rounded-md overflow-hidden">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm font-medium text-ink mb-1 truncate">{product.title}</p>
                  <p className="text-xs text-muted mb-1">{product.category}</p>
                  <p className="text-sm text-ink mb-3">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs text-accent mb-3">
                    {renderStars(product.rating)}
                    <span className="text-muted ml-1">{product.rating.toFixed(1)}</span>
                  </p>
                  {(() => {
                    const cartItem = items.find((it) => it.id === product.id)

                    if (cartItem) {
                      return (
                        <div className="flex items-center justify-between gap-2">
                           <button
                            onClick={() => removeItem(product.id)}
                            className="text-sm text-danger px-2 py-1 rounded-md border border-danger flex items-center justify-center"
                            aria-label={`Remove ${product.title} from cart`}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2 ml-auto">
                            <button
                              onClick={() => decreaseQuantity(product.id)}
                              className="w-8 h-8 bg-surface border border-border rounded-md text-ink"
                              aria-label={`Decrease quantity of ${product.title}`}
                            >
                              −
                            </button>

                            <div className="px-3 text-sm font-medium">{cartItem.quantity}</div>

                            <button
                              onClick={() => addItem(product)}
                              className="w-8 h-8 bg-accent text-white rounded-md flex items-center justify-center"
                              aria-label={`Increase quantity of ${product.title}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    }

                    return (
                      <button
                        onClick={() => addItem(product)}
                        className="w-full bg-accent text-white text-sm font-medium py-1.5 rounded-md"
                      >
                        Add to cart
                      </button>
                    )
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}