import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { forgotPasswordAPI, forgotPasswordVerifyAPI } from '../../api/auth.api'
import { useToast } from '../../context/ToastContext'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPasswordAPI(email)
      toast.success('OTP yuborildi')
      navigate('/forgot-password-verify', { state: { email } })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <h1>AUTOBAZAR</h1>
          <p>Parolni tiklash</p>
        </div>
        <h2 className="auth-title">Parolni unutdingizmi?</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 20 }}>
          Emailingizga OTP kodi yuboramiz
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="email@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'OTP yuborish'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/">Kirish sahifasiga qaytish</Link>
        </div>
      </div>
    </div>
  )
}

export function ForgotPasswordVerify() {
  const navigate = useNavigate()
  const toast = useToast()
  const { state } = useLocation()
  const locationEmail = state?.email || ''
  const [form, setForm] = useState({ otp: '', newPassword: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPasswordVerifyAPI({ email: locationEmail, otp: form.otp, newPassword: form.newPassword })
      toast.success('Parol yangilandi! Kiring')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <h1>AUTOBAZAR</h1>
          <p>Yangi parol o'rnatish</p>
        </div>
        <h2 className="auth-title">Yangi parol</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">OTP kod</label>
            <input className="form-input" placeholder="123456" value={form.otp}
              onChange={e => setForm(p => ({ ...p, otp: e.target.value }))} required maxLength={6} />
          </div>
          <div className="form-group">
            <label className="form-label">Yangi parol</label>
            <input className="form-input" type="password" placeholder="Min 6 ta belgi" value={form.newPassword}
              onChange={e => setForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Saqlanmoqda...' : 'Parolni yangilash'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/">Kirish sahifasiga qaytish</Link>
        </div>
      </div>
    </div>
  )
}