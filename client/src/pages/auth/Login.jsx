import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { setPendingEmail } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await loginAPI(form)
      setPendingEmail(form.email)
      toast.success('Emailingizga OTP yuborildi')
      navigate('/verify')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Kirish xatosi')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <h1>AUTOBAZAR</h1>
          <p>Premium avtomobil platformasi</p>
        </div>

        <h2 className="auth-title">Kirish</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="email@example.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Parol</label>
            <input className="form-input" type="password" placeholder="••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Kirilmoqda...' : 'Kirish'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">Hisobingiz yo'qmi? Ro'yxatdan o'ting</Link>
          <Link to="/forgot-password">Parolni unutdingizmi?</Link>
        </div>
      </div>
    </div>
  )
}
