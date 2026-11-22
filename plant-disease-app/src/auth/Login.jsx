import { useState } from 'react'
import { loginUser, registerUser } from '../services/api'
import './Login.css'
function Login({ onLogin }) {
const [role, setRole] = useState('user')
const [mode, setMode] = useState('login') // 'login' or 'register' (users only)
const [name, setName] = useState('')
const [userId, setUserId] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)
const isRegister = mode === 'register' && role === 'user'
const handleLogin = async (e) => {
e.preventDefault()
setError('')
setLoading(true)
try {
const data = isRegister
? await registerUser(name.trim(), userId.trim(), password)
: await loginUser(userId.trim(), password)
// the account must match the tab that was selected
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
userId: data.user.email,
token: data.token,
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
<div className="brand-icon">&#x1F33F;</div>
<h1>LeafCare</h1>
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
&#x1F464; User Login
</button>
<button
type="button"
className={role === 'admin' ? 'role-btn active' : 'role-btn'}
onClick={() => {
setRole('admin')
setError('')
}}
>
&#x1F6E1;&#xFE0F; Admin Login
</button>
</div>
<form onSubmit={handleLogin} className="login-form">
{isRegister && (
<>
<label>Full Name</label>
<input
type="text"
placeholder="Enter your name"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>
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
<button type="submit" className="login-submit" disabled={loading}>
{loading
? 'Please wait...'
: isRegister
? 'Create Account →'
: `Login as ${role === 'user' ? 'User' : 'Admin'} →`}
</button>
</form>
{role === 'user' && (
<p className="login-switch">
{isRegister ? 'Already have an account?' : "New to LeafCare?"}{' '}
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
© 2026 LeafCare | Smart Agriculture Platform
</p>
</div>
</div>
)
}
export default Login