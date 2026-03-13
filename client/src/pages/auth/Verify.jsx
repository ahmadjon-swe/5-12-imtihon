import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { verifyAPI, resendOtpAPI } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Verify() {
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const refs = useRef([])
  const { pendingEmail, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!pendingEmail) navigate('/')
  }, [pendingEmail, navigate])

  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (text.length === 6) {
      setDigits(text.split(''))
      refs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) return toast.warning('OTP ni to\'liq kiriting')
    setLoading(true)
    try {
      const res = await verifyAPI({ email: pendingEmail, otp })
      const payload = JSON.parse(atob(res.data.token.split('.')[1]))
      login(res.data.token, payload)
      toast.success('Xush kelibsiz!')
      const isAdminRole = payload.role === 'admin' || payload.role === 'superadmin'
      navigate(isAdminRole ? '/admin' : '/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP noto\'g\'ri')
      setDigits(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } finally { setLoading(false) }
  }

  const handleResend = async () => {
    try {
      await resendOtpAPI(pendingEmail)
      setResendTimer(60)
      toast.success('OTP qayta yuborildi')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card animate-up">
        <div className="auth-logo">
          <h1>AUTOBAZAR</h1>
          <p>Email tasdiqlash</p>
        </div>

        <h2 className="auth-title">OTP kiriting</h2>
        <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 8 }}>
          <strong style={{ color: 'var(--primary)' }}>{pendingEmail}</strong> ga 6 raqamli kod yuborildi
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-container">
            {digits.map((d, i) => (
              <input key={i} ref={el => refs.current[i] = el}
                className="otp-input" maxLength={1} value={d}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                onPaste={handlePaste}
                inputMode="numeric" />
            ))}
          </div>
          <button className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {resendTimer > 0
            ? <span style={{ color: 'var(--text3)', fontSize: 13 }}>Qayta yuborish: {resendTimer}s</span>
            : <button className="btn btn-ghost btn-sm" onClick={handleResend}>Qayta yuborish</button>
          }
        </div>
      </div>
    </div>
  )
}