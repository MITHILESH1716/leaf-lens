
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import QRCode from 'qrcode'

import { useCart } from '../context/CartContext'
import {
  createOrder,
  getOrderStatus,
} from '../services/api'

function Cart() {
  const {
    items,
    changeQty,
    removeItem,
    clearCart,
    totalPrice,
  } = useCart()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  })

  const [qrOrder, setQrOrder] = useState(null)
  const [qrImage, setQrImage] = useState('')
  const [completedOrder, setCompletedOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingPayment, setCheckingPayment] = useState(true)

  const clearCartRef = useRef(clearCart)
  clearCartRef.current = clearCart

  // Generate QR image when a new order is created
  useEffect(() => {
    if (!qrOrder) {
      setQrImage('')
      return
    }

    let cancelled = false

    async function generateQR() {
      try {
        const publicAppUrl =
          import.meta.env.VITE_PUBLIC_APP_URL ||
          window.location.origin

        const paymentUrl =
          `${publicAppUrl}/demo-pay/${qrOrder.paymentToken}`

        const image = await QRCode.toDataURL(paymentUrl, {
          width: 250,
          margin: 2,
          errorCorrectionLevel: 'H',
        })

        if (!cancelled) {
          setQrImage(image)
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to generate QR code: ' + err.message)
        }
      }
    }

    generateQR()

    return () => {
      cancelled = true
    }
  }, [qrOrder])

  // Create pending order
  async function placeOrder(e) {
    e.preventDefault()
    setError('')

    if (items.length === 0) {
      setError('Your cart is empty')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          id: String(item.id),
          qty: item.qty,
        })),
        delivery: form,
      }

      const response = await createOrder(orderData)

      setQrOrder({
        orderId: response.orderId,
        paymentToken: response.paymentToken,
        totalAmount: response.totalAmount,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Check payment status every 3 seconds
  useEffect(() => {
    if (!qrOrder) return

    let active = true
    let intervalId

    async function checkPayment() {
      try {
        const result = await getOrderStatus(qrOrder.orderId)

        if (!active) return

        if (result.paymentStatus === 'paid') {
          clearInterval(intervalId)

          setCompletedOrder({
            orderId: result.orderId,
            totalAmount: result.totalAmount,
            paymentReference: result.paymentReference,
          })

          clearCartRef.current()
          setQrOrder(null)
        }

        setCheckingPayment(true)
      } catch (err) {
        if (active) {
          console.error('Payment status check:', err.message)
          setCheckingPayment(false)
        }
      }
    }

    checkPayment()
    intervalId = setInterval(checkPayment, 3000)

    return () => {
      active = false
      clearInterval(intervalId)
    }
  }, [qrOrder])

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  // Successful payment screen
  if (completedOrder) {
    return (
      <section className="empty-state">
        <h1 style={{ color: '#2e7d32' }}>
          ✓ Payment Successful!
        </h1>

        <p>Your demo payment has been completed successfully.</p>

        <div
          className="card"
          style={{ maxWidth: '450px', margin: '24px auto' }}
        >
          <p>
            <strong>Order ID:</strong>
            <br />
            {completedOrder.orderId}
          </p>

          <p>
            <strong>Amount paid:</strong>
            <br />
            ₹{completedOrder.totalAmount}
          </p>

          <p>
            <strong>Demo reference:</strong>
            <br />
            {completedOrder.paymentReference}
          </p>

          <p className="muted">
            This is a simulated payment. No actual money was transferred.
          </p>
        </div>

        <Link to="/shop" className="btn">
          Continue shopping
        </Link>
      </section>
    )
  }

  // QR screen
  if (qrOrder) {
    return (
      <section className="empty-state">
        <h1>Complete Your Payment</h1>

        <p className="muted">
          Scan this QR code using your phone.
        </p>

        <div
          className="card"
          style={{
            maxWidth: '420px',
            margin: '24px auto',
            textAlign: 'center',
          }}
        >
          <h2>Demo UPI Payment</h2>

          {qrImage ? (
            <div
              style={{
                background: '#ffffff',
                padding: '15px',
                display: 'inline-block',
                borderRadius: '12px',
                margin: '16px 0',
              }}
            >
              <img
                src={qrImage}
                alt="Demo payment QR code"
                width="250"
                height="250"
              />
            </div>
          ) : (
            <p>Generating QR code...</p>
          )}

          <h2 style={{ color: '#2e7d32', fontSize: '2rem' }}>
            ₹{qrOrder.totalAmount}
          </h2>

          <p className="muted">
            Order ID: {qrOrder.orderId}
          </p>

          {error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}

          <p style={{ color: '#b7791f' }}>
            {checkingPayment
              ? 'Waiting for payment confirmation...'
              : 'Unable to check payment status. Retrying...'}
          </p>

          <p className="muted">
            Keep this page open until payment is completed.
          </p>

          <p className="muted">
            Demo payment only. No real money will be transferred.
          </p>
        </div>
      </section>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <section className="empty-state">
        <h1>Your cart is empty</h1>
        <p className="muted">
          Add some products from the shop.
        </p>
        <Link to="/shop" className="btn">
          Go to shop
        </Link>
      </section>
    )
  }

  // Normal cart
  return (
    <section>
      <h1>Your Cart</h1>

      <div className="cart-layout">
        <div className="card">
          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <p className="muted">
                  ₹{item.price} each
                </p>
              </div>

              <div className="qty">
                <button
                  type="button"
                  onClick={() => changeQty(item.id, -1)}
                >
                  −
                </button>

                <span>{item.qty}</span>

                <button
                  type="button"
                  onClick={() => changeQty(item.id, 1)}
                >
                  +
                </button>
              </div>

              <strong>₹{item.price * item.qty}</strong>

              <button
                type="button"
                className="link-btn"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <form className="card form" onSubmit={placeOrder}>
          <h3>Delivery details</h3>

          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            maxLength="10"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <textarea
            name="address"
            rows="3"
            placeholder="Delivery address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          {error && (
            <p style={{ color: 'red' }}>{error}</p>
          )}

          <button
            className="btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating order...' : 'Place order'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Cart
