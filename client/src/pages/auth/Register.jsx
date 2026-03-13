import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAPI } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Register() {
  const [form, setForm] = useState({ username: '', firstname: '', lastname: '', email: '', phoneNumber: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setPendingEmail } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerAPI(form)
      setPendingEmail(form.email)
      toast.success('Emailingizga OTP yuborildi')
      navigate('/verify')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ro\'yxatdan o\'tish xatosi')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <h1>AUTOBAZAR</h1>
          <p>Yangi hisob yarating</p>
        </div>

        <h2 className="auth-title">Ro'yxatdan o'tish</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Ism</label>
              <input className="form-input" placeholder="Ahmadjon" value={form.firstname} onChange={set('firstname')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Familiya</label>
              <input className="form-input" placeholder="Qosimov" value={form.lastname} onChange={set('lastname')} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" placeholder="ahmadjon" value={form.username} onChange={set('username')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Telefon raqam</label>
            <input className="form-input" placeholder="+998901234567" value={form.phoneNumber} onChange={set('phoneNumber')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input className="form-input" type="password" placeholder="Min 6 ta belgi" value={form.password} onChange={set('password')} required minLength={6} />
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Yaratilmoqda...' : 'Hisob yaratish'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/">Hisobingiz bormi? Kiring</Link>
        </div>
      </div>
    </div>
  )
}
