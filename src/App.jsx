import { useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import HomeSkeleton from './components/HomeSkeleton'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import History from './pages/History'

function App() {
  const [lat, setLat] = useState(null)
  const [long, setLong] = useState(null)
  const [geoError, setGeoError] = useState(false)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude)
        setLong(pos.coords.longitude)
      },
      () => setGeoError(true)
    )
  }, [])

  if (geoError) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white flex-col gap-4">
        <p className="text-2xl">📍 Location access denied</p>
        <p className="text-white/60 text-sm">Please allow location access and refresh the page.</p>
      </div>
    )
  }

  if (!lat || !long) {
    return (
      <div className="w-full min-h-screen flex flex-col">
        <Header />
        <HomeSkeleton />
        <Footer />
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col">
      <Header />
      <div className="w-full flex-1">
        <Routes>
          <Route path="/" element={<Home lat={lat} long={long} />} />
          <Route path="/history" element={<History lat={lat} long={long} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
