import { useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler, zoomPlugin
)

const getOptions = (yAxisLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: 'rgba(255,255,255,0.8)', boxWidth: 12 } },
    zoom: {
      pan: { enabled: true, mode: 'x' },
      zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
    },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 8 },
      grid: { color: 'rgba(255,255,255,0.07)' },
    },
    y: {
      title: { display: true, text: yAxisLabel, color: 'rgba(255,255,255,0.5)' },
      ticks: { color: 'rgba(255,255,255,0.5)' },
      grid: { color: 'rgba(255,255,255,0.07)' },
    },
  },
})

const hasData = (arr) => Array.isArray(arr) && arr.some((v) => v != null && v !== 0)

function HourlyCharts({ hourlyWeather, hourlyAir }) {
  const [isFahrenheit, setIsFahrenheit] = useState(false)

  if (!hourlyWeather || !hourlyAir) return null

  const labels = hourlyWeather.time.map((t) => {
    const d = new Date(t)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })

  const temps = isFahrenheit
    ? hourlyWeather.temperature_2m.map((c) => parseFloat(((c * 9) / 5 + 32).toFixed(1)))
    : hourlyWeather.temperature_2m

  const ChartWrapper = ({ title, children, showToggle }) => (
    <div className="bg-black/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 md:p-5 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        {showToggle && (
          <button
            onClick={() => setIsFahrenheit(!isFahrenheit)}
            className="text-xs bg-white/10 hover:bg-white/20 transition px-3 py-1 rounded-full border border-white/20"
          >
            Switch to {isFahrenheit ? '°C' : '°F'}
          </button>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[500px] h-[260px]">
          {children}
        </div>
      </div>
    </div>
  )

  const UnavailableCard = ({ title }) => (
    <div className="bg-black/30 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 md:p-5 w-full overflow-hidden">
      <h3 className="text-white font-semibold text-sm mb-4">{title}</h3>
      <div className="min-h-[260px] flex items-center justify-center">
        <p className="text-white/30 text-sm">Not available for past dates</p>
      </div>
    </div>
  )

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">

      <ChartWrapper title={`Temperature (${isFahrenheit ? '°F' : '°C'})`} showToggle>
        <Line
          options={getOptions(`Temp (${isFahrenheit ? '°F' : '°C'})`)}
          data={{
            labels,
            datasets: [{ label: 'Temperature', data: temps, borderColor: 'rgb(250,204,21)', backgroundColor: 'rgba(250,204,21,0.1)', fill: true, tension: 0.4, pointRadius: 0 }],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Relative Humidity">
        <Line
          options={getOptions('Humidity (%)')}
          data={{
            labels,
            datasets: [{ label: 'Humidity', data: hourlyWeather.relative_humidity_2m, borderColor: 'rgb(167,139,250)', backgroundColor: 'rgba(167,139,250,0.1)', fill: true, tension: 0.4, pointRadius: 0 }],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Precipitation">
        <Bar
          options={getOptions('Precipitation (mm)')}
          data={{
            labels,
            datasets: [{ label: 'Precipitation', data: hourlyWeather.precipitation, backgroundColor: 'rgba(56,189,248,0.8)', borderRadius: 3 }],
          }}
        />
      </ChartWrapper>

      {hasData(hourlyWeather.visibility) ? (
        <ChartWrapper title="Visibility">
          <Line
            options={getOptions('Visibility (m)')}
            data={{
              labels,
              datasets: [{ label: 'Visibility', data: hourlyWeather.visibility, borderColor: 'rgb(148,163,184)', tension: 0.4, pointRadius: 0 }],
            }}
          />
        </ChartWrapper>
      ) : (
        <UnavailableCard title="Visibility" />
      )}

      <ChartWrapper title="Wind Speed (10m)">
        <Line
          options={getOptions('Speed (km/h)')}
          data={{
            labels,
            datasets: [{ label: 'Wind Speed', data: hourlyWeather.wind_speed_10m, borderColor: 'rgb(248,113,113)', tension: 0.4, pointRadius: 0 }],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Air Quality — PM10 & PM2.5">
        <Line
          options={getOptions('Concentration (μg/m³)')}
          data={{
            labels,
            datasets: [
              { label: 'PM10', data: hourlyAir.pm10, borderColor: 'rgb(251,146,60)', tension: 0.4, pointRadius: 0 },
              { label: 'PM2.5', data: hourlyAir.pm2_5, borderColor: 'rgb(244,63,94)', tension: 0.4, pointRadius: 0 },
            ],
          }}
        />
      </ChartWrapper>

    </div>
  )
}

export default HourlyCharts
