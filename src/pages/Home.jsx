import { useState } from 'react'
import { useWeather } from '../customhooks/useWeather'
import HourlyCharts from '../components/HourlyCharts'
import HomeSkeleton from '../components/HomeSkeleton'

function getWeatherTheme(code) {
  if (code === 0) return { text: 'Clear Sky', bg: 'bg-linear-to-br from-sky-400 to-blue-600' }
  if (code >= 1 && code <= 3) return { text: 'Partly Cloudy', bg: 'bg-linear-to-br from-slate-400 to-gray-600' }
  if (code >= 45 && code <= 48) return { text: 'Foggy', bg: 'bg-linear-to-br from-gray-400 to-slate-500' }
  if (code >= 51 && code <= 67) return { text: 'Rainy', bg: 'bg-linear-to-br from-slate-700 to-blue-900' }
  if (code >= 71 && code <= 86) return { text: 'Snow', bg: 'bg-linear-to-br from-blue-100 to-sky-300' }
  if (code >= 95) return { text: 'Thunderstorm', bg: 'bg-linear-to-br from-indigo-900 to-purple-900' }
  return { text: 'Clear', bg: 'bg-linear-to-br from-blue-500 to-cyan-600' }
}

function getAqiStatus(aqi) {
  if (aqi == null) return { label: 'N/A', color: 'text-white/50' }
  if (aqi <= 50) return { label: 'Good', color: 'text-green-400' }
  if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-400' }
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-orange-400' }
  if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-400' }
  return { label: 'Hazardous', color: 'text-purple-400' }
}

const StatCard = ({ label, value, sub }) => (
  <div className="bg-black/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-3 md:p-4 text-white flex flex-col gap-1 hover:bg-black/40 transition">
    <p className="text-white/50 text-xs uppercase tracking-wider leading-tight">{label}</p>
    <p className="text-base md:text-xl font-bold truncate">{value ?? '—'}</p>
    {sub && <p className="text-white/50 text-xs">{sub}</p>}
  </div>
)

function Home({ lat, long }) {
  const today = new Date().toLocaleDateString('en-CA')
  const [selectedDate, setSelectedDate] = useState(today)
  const [pendingDate, setPendingDate] = useState(today)

  const todayObj = new Date()
  const maxDateObj = new Date()
  maxDateObj.setDate(todayObj.getDate() + 14)
  const minDateObj = new Date()
  minDateObj.setDate(todayObj.getDate() - 60)

  const minDate = minDateObj.toLocaleDateString('en-CA')
  const maxDate = maxDateObj.toLocaleDateString('en-CA')

  const { dailyWeatherState, airState, isLoading, error } = useWeather(lat, long, selectedDate)

  const isPastDate = selectedDate < today

  if (isLoading) {
    return <HomeSkeleton />
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-900 text-red-400 font-medium">
        {error}
      </div>
    )
  }

  if (!dailyWeatherState || !airState) {
    return <HomeSkeleton />
  }

  const current = dailyWeatherState?.current
  const daily = dailyWeatherState?.daily
  const air = airState?.current
  const theme = getWeatherTheme(current?.weather_code ?? 0)
  const aqiStatus = getAqiStatus(air?.us_aqi)

  const formatTime = (isoStr) => isoStr?.split('T')[1] ?? '—'

  const currentTemp = isPastDate
    ? daily?.temperature_2m_mean?.[0] ?? daily?.temperature_2m_max?.[0]
    : current?.temperature_2m
  const currentHumidity = isPastDate
    ? '—'
    : current?.relative_humidity_2m

  return (
    <div className={`min-h-screen w-full ${theme.bg} pt-24 pb-16 px-4 md:px-10 flex flex-col items-center`}>
      <div className="w-full max-w-6xl">

        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 mb-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/60 text-sm">📍 {lat.toFixed(4)}, {long.toFixed(4)}</p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-white/80 text-sm font-medium shrink-0">Date:</label>
            <input
              type="date"
              value={pendingDate}
              min={minDate}
              max={maxDate}
              onChange={(e) => setPendingDate(e.target.value)}
              className="bg-black/40 text-white border border-white/30 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-blue-400 flex-1 sm:flex-none min-w-0"
            />
            <button
              onClick={() => setSelectedDate(pendingDate)}
              disabled={pendingDate === selectedDate}
              className="bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-white text-sm font-medium px-4 py-1.5 rounded-lg shrink-0"
            >
              Go
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center mb-10 text-white text-center">
          <p className="text-lg font-medium tracking-wide opacity-80 mb-1">{theme.text}</p>
          <h1 className="text-[80px] sm:text-[120px] md:text-[160px] font-bold leading-none drop-shadow-2xl">
            {currentTemp != null ? `${Math.round(currentTemp)}°` : '—'}
          </h1>
          <p className="mt-3 text-base bg-black/20 px-5 py-1.5 rounded-full border border-white/10">
            H: {daily?.temperature_2m_max?.[0]}° · L: {daily?.temperature_2m_min?.[0]}°
          </p>
        </div>

        <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">Weather Conditions</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Current Temp" value={currentTemp != null ? `${currentTemp}°C` : '—'} />
          <StatCard label="Max Temp" value={`${daily?.temperature_2m_max?.[0]}°C`} />
          <StatCard label="Min Temp" value={`${daily?.temperature_2m_min?.[0]}°C`} />
          <StatCard label="Precipitation" value={`${daily?.precipitation_sum?.[0] ?? 0} mm`} />
          <StatCard label="Sunrise" value={formatTime(daily?.sunrise?.[0])} />
          <StatCard label="Sunset" value={formatTime(daily?.sunset?.[0])} />
          <StatCard label="Max Wind Speed" value={`${daily?.wind_speed_10m_max?.[0]} km/h`} />
          <StatCard label="Humidity" value={currentHumidity !== '—' ? `${currentHumidity}%` : '—'} />
          <StatCard label="UV Index" value={daily?.uv_index_max?.[0]} />
          <StatCard label="Rain Probability" value={`${daily?.precipitation_probability_max?.[0]}%`} />
        </div>

        <p className="text-white/60 text-xs uppercase tracking-widest mb-3 font-semibold">Air Quality</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-black/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-3 md:p-4 text-white col-span-2 sm:col-span-1 hover:bg-black/40 transition">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-1">AQI (US)</p>
            <p className="text-3xl font-bold">{air?.us_aqi ?? '—'}</p>
            <p className={`text-sm font-medium mt-1 ${aqiStatus.color}`}>{aqiStatus.label}</p>
          </div>
          <StatCard label="PM10" value={air?.pm10 != null ? `${air.pm10} μg/m³` : '—'} />
          <StatCard label="PM2.5" value={air?.pm2_5 != null ? `${air.pm2_5} μg/m³` : '—'} />
          <StatCard label="Carbon Monoxide" value={air?.carbon_monoxide != null ? `${air.carbon_monoxide} μg/m³` : '—'} />
          <StatCard label="Nitrogen Dioxide" value={air?.nitrogen_dioxide != null ? `${air.nitrogen_dioxide} μg/m³` : '—'} />
          <StatCard label="Sulphur Dioxide" value={air?.sulphur_dioxide != null ? `${air.sulphur_dioxide} μg/m³` : '—'} />
          <StatCard label="Carbon Dioxide" value={airState?.hourly?.carbon_dioxide?.[0] != null ? `${airState.hourly.carbon_dioxide[0]} ppm` : '—'} sub="First hourly reading" />
        </div>

        <p className="text-white/60 text-xs uppercase tracking-widest mb-4 font-semibold">Hourly Forecast</p>
        <HourlyCharts
          hourlyWeather={dailyWeatherState?.hourly}
          hourlyAir={airState?.hourly}
        />

      </div>
    </div>
  )
}

export default Home
