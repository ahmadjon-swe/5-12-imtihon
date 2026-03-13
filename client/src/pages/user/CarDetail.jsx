import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getOneCarAPI, saveCarAPI } from '../../api/index'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n)

export default function CarDetail() {
  const { id } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgMode, setImgMode] = useState('outer') // 'outer' | 'inner'
  const [saving, setSaving] = useState(false)
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    getOneCarAPI(id)
      .then(r => setCar(r.data))
      .catch(() => toast.error('Avtomobil topilmadi'))
      .finally(() => setLoading(false))
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    if (!user) return navigate('/login')
    setSaving(true)
    try {
      const res = await saveCarAPI(id)
      toast.success(res.data.message)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Xato')
    } finally { setSaving(false) }
  }

  if (loading) return <><Navbar /><div className="page"><div className="loading"><div className="spinner" /></div></div></>
  if (!car) return <><Navbar /><div className="page"><div className="container"><div className="empty-state"><h3>Topilmadi</h3></div></div></div></>

  const bigImg = imgMode === 'outer' ? car.outerImageUrl : car.innerImageUrl

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="breadcrumb" style={{ marginBottom: 24 }}>
            <Link to="/">Bosh sahifa</Link>
            <span>›</span>
            <span>{car.name}</span>
          </div>

          <div className="car-detail">
            {/* Gallery */}
            <div className="car-detail-gallery">
              <div className="car-detail-main-image">
                <img src={`/${bigImg}`} alt={car.name}
                  onError={e => { e.target.src = 'https://placehold.co/800x500/1a1a24/888?text=No+Image' }} />
              </div>
              <div className="car-detail-img-toggle">
                <button className={`btn btn-sm ${imgMode === 'outer' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setImgMode('outer')}>🚗 Tashqi</button>
                <button className={`btn btn-sm ${imgMode === 'inner' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setImgMode('inner')}>🪑 Ichki</button>
              </div>
              {/* Main image thumbnail */}
              <div style={{ marginTop: 10, borderRadius: 10, overflow: 'hidden', height: 100 }}>
                <img src={`/${car.mainImageUrl}`} alt="main"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = 'https://placehold.co/400x200/1a1a24/888?text=Main' }} />
              </div>
            </div>

            {/* Info */}
            <div className="car-detail-info">
              <div className="car-detail-category">{car.category?.name} • {car.color}</div>
              <h1 className="car-detail-name">{car.name}</h1>
              <div className="car-detail-price">${fmt(car.price)}</div>

              <div className="car-detail-specs">
                {[
                  ['Yil', car.year],
                  ['Motor', car.motor + 'L'],
                  ['Yurgan', fmt(car.distance) + ' km'],
                  ['Karobka', car.gearbook],
                  ['TAN', car.tan ? 'Bor' : 'Yo\'q'],
                  ['Rang', car.color],
                ].map(([label, value]) => (
                  <div key={label} className="spec-item">
                    <div className="spec-label">{label}</div>
                    <div className="spec-value">{value}</div>
                  </div>
                ))}
              </div>

              <p className="car-detail-desc">{car.description}</p>

              <div className="car-detail-actions">
                <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving}>
                  {saving ? '...' : '🔖 Saqlash'}
                </button>
                <button className="btn btn-outline" onClick={() => navigate(-1)}>
                  ← Orqaga
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
