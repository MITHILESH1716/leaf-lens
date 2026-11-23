
import { useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import Login from './auth/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Agriculture from './pages/Agriculture'
import Detect from './pages/Detect'
import Result from './pages/Result'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'

import DemoPayment from './pages/DemoPayment'
import lensLogo from './assets/lens-logo.png'

function App() {
  const location = useLocation()

  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('leafcareUser')
    return saved ? JSON.parse(saved) : null
  })

  const handleLogin = (account) => {
    sessionStorage.setItem('leafcareUser', JSON.stringify(account))
    setUser(account)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('leafcareUser')
    setUser(null)
  }

  // FIRST: Allow payment page without login
  // No Navbar or Footer on this page
  if (location.pathname.startsWith('/demo-pay/')) {
    return (
      <Routes>
        <Route
          path="/demo-pay/:token"
          element={<DemoPayment />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    )
  }

  // SECOND: Show login page for normal website
  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  // THIRD: Admin dashboard
  if (user.role === 'admin') {
    return (
      <>
        <header className="navbar">
          <div className="container">
            <span className="logo">
              LeafLens Admin
              <img
                src={lensLogo}
                alt=""
                className="logo-img"
              />
            </span>

            <button
              className="btn btn-small"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <main className="container page">
          <AdminDashboard user={user} />
        </main>

        <Footer />
      </>
    )
  }

  // FOURTH: Normal user website
  return (
    <>
      <Navbar onLogout={handleLogout} />

      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agriculture" element={<Agriculture />} />
          <Route path="/detect" element={<Detect />} />
          <Route path="/result" element={<Result />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
