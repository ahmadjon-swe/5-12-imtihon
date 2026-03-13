import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getAllCategoriesAPI } from '../api/index'
import { useToast } from '../context/ToastContext'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getAllCategoriesAPI({ page: 1, limit: 20, search })
        setCategories(res.data.data)
      } catch {
        toast.error('Kategoriyalar yuklanmadi')
      } finally { setLoading(false) }
    }
    const t = setTimeout(fetch, 300)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">

          {/* Hero */}
          <div style={{ textAlign: 'center', padding: '40px 0 48px', borderBottom: '1px solid var(--border)', marginBottom: 40 }}>
            <div style={{ color: 'var(--primary)', fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', marginBottom: 14 }}>
              Premium avtomobil platformasi
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 60px)', fontWeight: 700, letterSpacing: 2, lineHeight: 1.1, marginBottom: 18 }}>
              AVTOMOBIL <span style={{ color: 'var(--primary)' }}>BOZORI</span>
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: 16, maxWidth: 440, margin: '0 auto 32px' }}>
              O'zingizga mos avtomobilni kategoriya bo'yicha toping
            </p>
            <input
              className="form-input"
              placeholder="🔍  Kategoriya qidirish..."
              style={{ maxWidth: 400, margin: '0 auto', display: 'block' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="section-header">
            <h2 className="section-title">Kategoriyalar</h2>
            <span style={{ color: 'var(--text3)', fontSize: 13 }}>{categories.length} ta</span>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              <h3>Kategoriya topilmadi</h3>
              <p>Qidiruv so'zini o'zgartiring</p>
            </div>
          ) : (
            <div className="grid-4">
              {categories.map((cat, i) => (
                <div
                  key={cat._id}
                  className="card category-card"
                  style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both`, cursor: 'pointer' }}
                  onClick={() => navigate(`/category/${cat._id}`)}
                >
                  <div className="category-card-image">
                    <img
                      src={`/${cat.imageUrl}`}
                      alt={cat.name}
                      onError={e => { e.target.src = 'https://placehold.co/400x300/1a1a24/888?text=' + cat.name }}
                    />
                    <div className="category-card-overlay">
                      <span className="category-card-name">{cat.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}