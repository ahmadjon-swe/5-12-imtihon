import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getMyCarsAPI, getMyCategoriesAPI, deleteCarAPI, deleteCategoryAPI } from '../../api/index'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import api from '../../api/axios'

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n)

// Role badge styles
const roleBadge = (role) => {
  const styles = {
    superadmin: { background: 'rgba(255,77,77,0.15)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.3)' },
    admin:      { background: 'rgba(232,197,71,0.15)', color: '#e8c547', border: '1px solid rgba(232,197,71,0.3)' },
    user:       { background: 'rgba(78,147,230,0.15)', color: '#4e93e6', border: '1px solid rgba(78,147,230,0.3)' },
  }
  return styles[role] || styles.user
}

export default function AdminDashboard() {
  const [cars, setCars] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [tab, setTab] = useState('cars')
  const [userSearch, setUserSearch] = useState('')
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const isSuperAdmin = user?.role === 'superadmin'

  const fetchAll = async () => {
    try {
      const [carsRes, catRes] = await Promise.all([
        getMyCarsAPI({ page: 1, limit: 50 }),
        getMyCategoriesAPI({ page: 1, limit: 50 })
      ])
      setCars(carsRes.data.data)
      setCategories(catRes.data.data)
    } catch { toast.error('Yuklanmadi') }
    finally { setLoading(false) }
  }

  const fetchUsers = async (search = '') => {
    setUsersLoading(true)
    try {
      const res = await api.get('/get_all_users', { params: { search, limit: 50 } })
      setUsers(res.data.data)
    } catch { toast.error('Foydalanuvchilar yuklanmadi') }
    finally { setUsersLoading(false) }
  }

  useEffect(() => {
    fetchAll()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tab === 'users' && isSuperAdmin) fetchUsers(userSearch)
  }, [tab, userSearch]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDeleteCar = async (id) => {
    if (!confirm("Avtomobilni o'chirishni tasdiqlaysizmi?")) return
    try {
      await deleteCarAPI(id)
      setCars(p => p.filter(c => c._id !== id))
      toast.success("O'chirildi")
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
  }

  const handleDeleteCategory = async (id) => {
    if (!confirm("Kategoriya va undagi BARCHA avtomobillar o'chiriladi. Tasdiqlaysizmi?")) return
    try {
      await deleteCategoryAPI(id)
      setCategories(p => p.filter(c => c._id !== id))
      toast.success("O'chirildi")
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
  }

  const handleChangeRole = async (userId) => {
    try {
      await api.patch(`/change_role_admin/${userId}`)
      toast.success("Rol o'zgartirildi")
      fetchUsers(userSearch)
    } catch (e) { toast.error(e.response?.data?.message || 'Xato') }
  }

  const tabs = [
    { key: 'cars', label: `🚗 Avtomobillar (${cars.length})` },
    { key: 'categories', label: `📂 Kategoriyalar (${categories.length})` },
    ...(isSuperAdmin ? [{ key: 'users', label: '👥 Foydalanuvchilar' }] : [])
  ]

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700 }}>
              Admin <span style={{ color: 'var(--primary)' }}>Panel</span>
            </h1>
          </div>

          {/* Stats */}
          <div className="admin-stats">
            <div className="stat-card">
              <div className="stat-number">{cars.length}</div>
              <div className="stat-label">Mening avtomobillarim</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{categories.length}</div>
              <div className="stat-label">Mening kategoriyalarim</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: 'var(--success)' }}>{cars.length}</div>
              <div className="stat-label">Faol e'lonlar</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            <Link to="/admin/add-car" className="btn btn-primary">+ Avtomobil qo'shish</Link>
            <Link to="/admin/add-category" className="btn btn-outline">+ Kategoriya qo'shish</Link>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`btn btn-sm ${tab === t.key ? 'btn-primary' : 'btn-ghost'}`}
                style={{ borderRadius: '8px 8px 0 0' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Cars tab */}
          {tab === 'cars' && (
            loading ? <div className="loading"><div className="spinner" /></div> :
            cars.length === 0 ? (
              <div className="empty-state">
                <h3>Avtomobil yo'q</h3>
                <Link to="/admin/add-car" className="btn btn-primary">Birinchi avtomobilni qo'shing</Link>
              </div>
            ) : (
              <div className="grid-3">
                {cars.map(car => (
                  <div key={car._id} className="card">
                    <div style={{ height: 160, overflow: 'hidden' }}>
                      <img src={`/${car.mainImageUrl}`} alt={car.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/600x400/1a1a24/888?text=No+Image' }} />
                    </div>
                    <div className="card-body">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{car.name}</div>
                      <div style={{ color: 'var(--primary)', fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 12 }}>${fmt(car.price)}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                          onClick={() => navigate(`/admin/edit-car/${car._id}`)}>✏ Tahrirlash</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCar(car._id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Categories tab */}
          {tab === 'categories' && (
            loading ? <div className="loading"><div className="spinner" /></div> :
            categories.length === 0 ? (
              <div className="empty-state">
                <h3>Kategoriya yo'q</h3>
                <Link to="/admin/add-category" className="btn btn-primary">Birinchi kategoriyani qo'shing</Link>
              </div>
            ) : (
              <div className="grid-4">
                {categories.map(cat => (
                  <div key={cat._id} className="card">
                    <div style={{ height: 120, overflow: 'hidden' }}>
                      <img src={`/${cat.imageUrl}`} alt={cat.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://placehold.co/400x300/1a1a24/888?text=' + cat.name }} />
                    </div>
                    <div className="card-body">
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{cat.name}</div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                          onClick={() => navigate(`/admin/edit-category/${cat._id}`)}>✏</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCategory(cat._id)}>🗑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Users tab - faqat superadmin */}
          {tab === 'users' && isSuperAdmin && (
            <div>
              <input className="form-input" placeholder="Username bo'yicha qidirish..."
                style={{ maxWidth: 320, marginBottom: 20 }}
                value={userSearch} onChange={e => setUserSearch(e.target.value)} />

              {usersLoading ? (
                <div className="loading"><div className="spinner" /></div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        {['Foydalanuvchi', 'Email', 'Telefon', 'Rol', 'Amal'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '14px' }}>
                            <div style={{ fontWeight: 500 }}>{u.firstname} {u.lastname}</div>
                            <div style={{ color: 'var(--text3)', fontSize: 12 }}>@{u.username}</div>
                          </td>
                          <td style={{ padding: '14px', color: 'var(--text2)', fontSize: 14 }}>{u.email}</td>
                          <td style={{ padding: '14px', color: 'var(--text2)', fontSize: 14 }}>{u.phoneNumber}</td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: 20,
                              fontSize: 12, fontWeight: 600,
                              ...roleBadge(u.role)
                            }}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            {u.role !== 'superadmin' && (
                              <button className="btn btn-outline btn-sm"
                                onClick={() => handleChangeRole(u._id)}>
                                {u.role === 'user' ? '⬆ Admin' : '⬇ User'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}