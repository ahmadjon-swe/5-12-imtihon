import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { changePasswordAPI, deleteAccountAPI } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'

export default function ProfileModal({ onClose }) {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [tab, setTab] = useState('info') // 'info' | 'password' | 'delete'
  const [loading, setLoading] = useState(false)
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' })
  const [deletePass, setDeletePass] = useState('')

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await changePasswordAPI(pwForm)
      toast.success('Parol yangilandi')
      setPwForm({ oldPassword: '', newPassword: '' })
      setTab('info')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato')
    } finally { setLoading(false) }
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await deleteAccountAPI(deletePass)
      logout()
      navigate('/')
      toast.success('Hisob o\'chirildi')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xato')
    } finally { setLoading(false) }
  }

  const roleLabel = user?.role === 'superadmin' ? 'Super Admin' : user?.role === 'admin' ? 'Admin' : 'Foydalanuvchi'

  return (
    <div className="profile-modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="profile-modal">
        <div className="profile-avatar">
          {user?.firstname?.[0]}{user?.lastname?.[0]}
        </div>
        <div className="profile-name">{user?.firstname} {user?.lastname}</div>
        <div className={`profile-role ${user?.role !== 'user' ? 'admin-badge' : ''}`}>{roleLabel}</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['info', 'password', 'delete'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`}
              style={{ flex: 1 }}>
              {t === 'info' ? 'Ma\'lumotlar' : t === 'password' ? 'Parol' : 'O\'chirish'}
            </button>
          ))}
        </div>

        {tab === 'info' && (
          <div className="profile-info">
            <div className="profile-info-row">
              <span className="profile-info-label">Username</span>
              <span className="profile-info-value">@{user?.username}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Email</span>
              <span className="profile-info-value">{user?.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-info-label">Telefon</span>
              <span className="profile-info-value">{user?.phoneNumber}</span>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Eski parol</label>
              <input className="form-input" type="password" value={pwForm.oldPassword}
                onChange={e => setPwForm(p => ({ ...p, oldPassword: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Yangi parol</label>
              <input className="form-input" type="password" value={pwForm.newPassword}
                onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} />
            </div>
            <button className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Yangilanmoqda...' : 'Parolni yangilash'}
            </button>
          </form>
        )}

        {tab === 'delete' && (
          <form onSubmit={handleDelete}>
            <p style={{ color: 'var(--text2)', fontSize: 14, marginBottom: 16 }}>
              Hisobingizni o'chirish uchun parolingizni kiriting. Bu amal qaytarib bo'lmaydi.
            </p>
            <div className="form-group">
              <label className="form-label">Parol</label>
              <input className="form-input" type="password" value={deletePass}
                onChange={e => setDeletePass(e.target.value)} required />
            </div>
            <button className="btn btn-danger btn-full" disabled={loading}>
              {loading ? '...' : 'Hisobni o\'chirish'}
            </button>
          </form>
        )}

        <div className="divider" />
        <button className="btn btn-ghost btn-full btn-sm" onClick={onClose}>Yopish</button>
      </div>
    </div>
  )
}
