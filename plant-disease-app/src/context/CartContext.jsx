
import { createContext, useContext, useState, useEffect } from 'react'
import { getProducts } from '../services/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Keep cart prices updated with the latest MongoDB product prices
  useEffect(() => {
    async function syncCartPrices() {
      try {
        const products = await getProducts()

        setItems((currentItems) =>
          currentItems.map((item) => {
            const latestProduct = products.find(
              (product) => String(product.id) === String(item.id)
            )

            if (!latestProduct) return item

            return {
              ...item,
              name: latestProduct.name,
              price: Number(latestProduct.price),
            }
          })
        )
      } catch (error) {
        console.error('Unable to sync cart prices:', error.message)
      }
    }

    syncCartPrices()
  }, [])

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  function addToCart(product) {
    const existing = items.find(
      (i) => String(i.id) === String(product.id)
    )

    if (existing) {
      setItems(
        items.map((i) =>
          String(i.id) === String(product.id)
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      )
    } else {
      setItems([
        ...items,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          qty: 1,
        },
      ])
    }
  }

  function changeQty(id, change) {
    setItems(
      items
        .map((i) =>
          String(i.id) === String(id)
            ? { ...i, qty: i.qty + change }
            : i
        )
        .filter((i) => i.qty > 0)
    )
  }

  function removeItem(id) {
    setItems(items.filter((i) => String(i.id) !== String(id)))
  }

  function clearCart() {
    setItems([])
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  const totalPrice = items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        changeQty,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext)
}
