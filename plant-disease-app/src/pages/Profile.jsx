import { useEffect, useRef, useState } from 'react'
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  getMyOrders,
} from '../services/api'
import './Profile.css'

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

function Profile() {
  const fileInput = useRef(null)

  const [profile, setProfile] = useState(null)
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState({
    name: '',
    username: '',
    building: '',
    area: '',
    city: '',
  })

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    setError('')

    try {
      const [profileData, orderData] = await Promise.all([
        getProfile(),
        getMyOrders(),
      ])

      const user = profileData.user
      const address = user.address || {}

      setProfile(user)
      setForm({
        name: user.name || '',
        username: user.username || '',
        building: address.building || '',
        area: address.area || '',
        city: address.city || '',
      })

      setOrders(orderData.orders || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await updateProfile({
        name: form.name,
        username: form.username,
        address: {
          building: form.building,
          area: form.area,
          city: form.city,
        },
      })

      setProfile((previous) => ({
        ...previous,
        ...response.user,
      }))

      setEditing(false)
      setMessage('Profile updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handlePictureChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5 MB')
      return
    }

    setError('')
    setMessage('Uploading picture...')

    try {
      const response = await uploadProfilePicture(file)

      setProfile((previous) => ({
        ...previous,
        profilePicture: response.profilePicture,
      }))

      setMessage('Profile picture updated!')
    } catch (err) {
      setError(err.message)
      setMessage('')
    } finally {
      e.target.value = ''
    }
  }

  if (loading) {
    return <p className="profile-loading">Loading your profile...</p>
  }

  if (error && !profile) {
    return <p className="error">{error}</p>
  }

  if (!profile) return null

  const fullAddress = [
    profile.address?.building,
    profile.address?.area,
    profile.address?.city,
    'Maharashtra',
  ].filter(Boolean).join(', ')

  return (
    <section className="profile-page">
      <div className="profile-heading">
        <div>
          <h1>My Profile</h1>
          <p className="muted">Manage your personal information and orders.</p>
        </div>
      </div>

      {message && <p className="profile-success">{message}</p>}
      {error && <p className="profile-error">{error}</p>}

      <div className="profile-card card">
        <div className="profile-top">
          <div className="profile-avatar">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
              />
            ) : (
              <span>👤</span>
            )}
          </div>

          <div className="profile-picture-actions">
            <h2>{profile.name}</h2>
            <p className="muted">@{profile.username || 'username'}</p>

            <button
              type="button"
              className="btn btn-small"
              onClick={() => fileInput.current?.click()}
            >
              Upload Profile Picture
            </button>

            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePictureChange}
            />
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-section-heading">
          <h2>Personal Information</h2>

          {!editing && (
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => {
                setEditing(true)
                setMessage('')
                setError('')
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input value={profile.email} disabled />

            <label>Building / Place Name</label>
            <input
              name="building"
              value={form.building}
              onChange={handleChange}
              required
            />

            <label>Area / Road</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              required
            />

            <label>City</label>
            <select
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            >
              <option value="">Select city</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <label>State</label>
            <input value="Maharashtra" disabled />

            <div className="profile-form-actions">
              <button
                type="submit"
                className="btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  const address = profile.address || {}

                  setForm({
                    name: profile.name || '',
                    username: profile.username || '',
                    building: address.building || '',
                    area: address.area || '',
                    city: address.city || '',
                  })

                  setEditing(false)
                  setError('')
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div>
              <span>Full Name</span>
              <strong>{profile.name}</strong>
            </div>

            <div>
              <span>Username</span>
              <strong>@{profile.username || 'Not set'}</strong>
            </div>

            <div>
              <span>Email</span>
              <strong>{profile.email}</strong>
            </div>

            <div>
              <span>Location</span>
              <strong>
                {profile.address?.city
                  ? `${profile.address.city}, Maharashtra`
                  : 'Please add your city'}
              </strong>
            </div>

            <div className="profile-address">
              <span>Full Address</span>
              <strong>{fullAddress || 'No address added'}</strong>
            </div>
          </div>
        )}
      </div>

      <div className="profile-orders card">
        <div className="profile-section-heading">
          <div>
            <h2>Order History</h2>
            <p className="muted">
              Your successfully completed orders.
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="profile-no-orders">
            <p>You haven't placed any completed orders yet.</p>
          </div>
        ) : (
          <div className="profile-order-list">
            {orders.map((order) => (
              <div className="profile-order" key={order._id}>
                <div className="profile-order-date">
                  <span>Order Date</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </strong>
                </div>

                <div className="profile-order-items">
                  <span>Items Purchased</span>
                  <strong>
                    {order.items.map((item) =>
                      `${item.name} × ${item.quantity}`
                    ).join(', ')}
                  </strong>
                </div>

                <div className="profile-order-amount">
                  <span>Amount</span>
                  <strong>₹{order.totalAmount}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
