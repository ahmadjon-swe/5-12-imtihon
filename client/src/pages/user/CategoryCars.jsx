import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { getOneCategoryAPI } from '../../api/index'
import { useToast } from '../../context/ToastContext'

const formatPrice = (n) => new Intl.NumberFormat('uz-UZ').format(n) + ' $'
const formatKm = (n) => new Intl.NumberFormat('uz-UZ').format(n) + ' km'

export default function CategoryCars() {
  const { id } = useParams()
  const [category, setCategory] = useState(null)
  const [allCars, setAllCars] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOneCategoryAPI(id)
        setCategory(res.data.category)
        setAllCars(res.data.cars || [])
        setCars(res.data.cars || [])
      } catch {
        toast.error("Ma'lumotlar yuklanmadi")
      } finally { setLoading(false) }
    }
    fetchData()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!search.trim()) {
      setCars(allCars)
    } else {
      setCars(allCars.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ))
    }
  }, [search, allCars])

  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          {category && (
            <div className="page-header">
              <div className="breadcrumb">
                <Link to="/">Bosh sahifa</Link>
                <span>›</span>
                <span>{category.name}</span>
              </div>
              <h1 className="section-title">{category.name} <span>avtomobillari</span></h1>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <input className="form-input" placeholder="🔍  Avtomobil qidirish..."
              style={{ maxWidth: 360 }}
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {loading ? (
            <div className="loading"><div className="spinner" /></div>
          ) : cars.length === 0 ? (
            <div className="empty-state">
              <h3>Avtomobil topilmadi</h3>
              <p>Bu kategoriyada hozircha avtomobil yo'q</p>
            </div>
          ) : (
            <div className="grid-3">
              {cars.map(car => (
                <div key={car._id} className="card car-card"
                  onClick={() => navigate(`/car/${car._id}`)}>
                  <div className="car-card-image">
                    <img src={`/${car.mainImageUrl}`} alt={car.name}
                      onError={e => { e.target.src = 'https://placehold.co/600x400/1a1a24/888?text=No+Image' }} />
                    <span className="car-card-badge">{car.year}</span>
                  </div>
                  <div className="car-card-body">
                    <div className="car-card-name">{car.name}</div>
                    <div className="car-card-category">{car.color} • {car.gearbook}</div>
                    <div className="car-card-meta">
                      <span className="car-card-meta-item">🛣 {formatKm(car.distance)}</span>
                      <span className="car-card-meta-item">⚙ {car.motor}L</span>
                      <span className="car-card-meta-item">{car.tan ? '✓ TAN' : '✕ TAN'}</span>
                    </div>
                    <div className="car-card-price">{formatPrice(car.price)}</div>
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