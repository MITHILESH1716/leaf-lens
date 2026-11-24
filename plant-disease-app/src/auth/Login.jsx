import { useState } from 'react'
import { loginUser, registerUser } from '../services/api'
import './Login.css'
import lensLogo from '../assets/lens-logo.png'

const CITIES = [
  'Mumbai',
  'Pune',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Ratnagiri',
  'Kolhapur',
  'Jalgaon',
  'Dharashiv',
  'Akola',
]

function Login({ onLogin }) {
  const [role, setRole] = useState('user')
  const [mode, setMode] = useState('login')

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')

  const [building, setBuilding] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register' && role === 'user'

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = isRegister
        ? await registerUser({
            name: name.trim(),
            username: username.trim(),
            email: userId.trim(),
            password,
            address: {
              building,
              area,
              city,
            },
          })
        : await loginUser(userId.trim(), password)

      if (data.user.role !== role) {
        setError(
          role === 'admin'
            ? 'This account does not have admin access.'
            : 'Please use the Admin Login tab for admin accounts.'
        )
        return
      }

      onLogin({
        role: data.user.role,
        name: data.user.name,
        username: data.user.username || '',
        userId: data.user.email,
        token: data.token,
        address: data.user.address,
        profilePicture: data.user.profilePicture || '',
      })
    } catch (err) {
      setError(err.message || 'Could not reach the server. Is it running?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-title">
            <h1>LeafLens</h1>
            <img src={lensLogo} alt="" className="brand-logo" />
          </div>
          <p>Smart Plant Disease Detection System</p>
        </div>

        <div className="login-heading">
          <h2>{isRegister ? 'Create Account' : 'Welcome Back!'}</h2>
          <p>
            {isRegister
              ? 'Register to start scanning your plants'
              : 'Login to continue to your account'}
          </p>
        </div>

        <div className="role-selector">
          <button
            type="button"
            className={role === 'user' ? 'role-btn active' : 'role-btn'}
            onClick={() => {
              setRole('user')
              setError('')
            }}
          >
            👤 User Login
          </button>

          <button
            type="button"
            className={role === 'admin' ? 'role-btn active' : 'role-btn'}
            onClick={() => {
              setRole('admin')
              setError('')
            }}
          >
            🛡️ Admin Login
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {isRegister && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label>Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <label>Building / Place Name</label>
              <input
                type="text"
                placeholder="Enter building or place name"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                required
              />

              <label>Area / Road</label>
              <input
                type="text"
                placeholder="Enter area or road"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />

              <label>City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">Select your city</option>
                {CITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label>State</label>
              <input type="text" value="Maharashtra" disabled />
            </>
          )}

          <label>User ID / Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isRegister
                ? 'Create Account →'
                : `Login as ${role === 'user' ? 'User' : 'Admin'} →`}
          </button>
        </form>

        {role === 'user' && (
          <p className="login-switch">
            {isRegister ? 'Already have an account?' : 'New to LeafCare?'}{' '}
            <button
              type="button"
              onClick={() => {
                setMode(isRegister ? 'login' : 'register')
                setError('')
              }}
            >
              {isRegister ? 'Login' : 'Create an account'}
            </button>
          </p>
        )}

        <p className="login-footer">
          © 2026 LeafLens | Smart Agriculture Platform
        </p>
      </div>
    </div>
  )
}

export default Login