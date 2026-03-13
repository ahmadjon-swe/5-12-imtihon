import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getSavedCarsAPI, saveCarAPI } from '../../api/index'
import { useToast } from '../../context/ToastContext'

const fmt = (n) => new Intl.NumberFormat('uz-UZ').format(n)

export default function SavedCars() {
  const [saved, setSaved] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  const fetchSaved = async () => {
    try {
      const res = await getSavedCarsAPI()
      setSaved(res.data.filter(s => s.isSaved))
    } catch { toast.error('Yuklanmadi') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSaved() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUnsave = async (carId) => {
    try {
      await saveCarAPI(carId)
      setSaved(prev => prev.filter(s => s.carInfo?._id !== carId))
      toast.success('Saqlashdan olib tashlandi')
    } catch { toast.error('Xato') }
  }

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="page-header">
            <div className="breadcrumb"><Link to="/">Bosh sahifa</Link><span>›</span><span>Saqlangan</span></div>
            <h1 className="section-title">Saqlangan <span>avtomobillar</span></h1>
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : saved.length === 0 ? (
            <div className="empty-state">
              <h3>Saqlangan avtomobil yo'q</h3>
              <p>Avtomobil sahifasidan 🔖 tugmasini bosing</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>Avtomobillarni ko'rish</button>
            </div>
          ) : (
            <div className="grid-3">
              {saved.map(s => {
                const car = s.carInfo
                if (!car) return null
                return (
                  <div key={s._id} className="card car-card">
                    <div className="car-card-image" onClick={() => navigate(`/car/${car._id}`)}>
                      <img src={`/${car.mainImageUrl}`} alt={car.name}
                        onError={e => { e.target.src = 'https://placehold.co/600x400/1a1a24/888?text=No+Image' }} />
                      <span className="car-card-badge">{car.year}</span>
                    </div>
                    <div className="car-card-body">
                      <div className="car-card-name">{car.name}</div>
                      <div className="car-card-price">${fmt(car.price)}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button className="btn btn-outline btn-sm" style={{ flex: 1 }}
                          onClick={() => navigate(`/car/${car._id}`)}>Ko'rish</button>
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleUnsave(car._id)}>✕</button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
