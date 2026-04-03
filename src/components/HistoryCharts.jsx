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

const timeToDecimal = (isoString) => {
  if (!isoString) return null
  const timePart = isoString.split('T')[1]
  if (!timePart) return null
  const [hours, minutes] = timePart.split(':').map(Number)
  return hours + minutes / 60
}

const getOptions = (yAxisLabel, tooltipCallbacks = {}) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: 'rgba(255,255,255,0.8)', boxWidth: 12 } },
    zoom: {
      pan: { enabled: true, mode: 'x' },
      zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' },
    },
    tooltip: { callbacks: tooltipCallbacks },
  },
  scales: {
    x: {
      ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 12 },
      grid: { color: 'rgba(255,255,255,0.07)' },
    },
    y: {
      title: { display: true, text: yAxisLabel, color: 'rgba(255,255,255,0.5)' },
      ticks: { color: 'rgba(255,255,255,0.5)' },
      grid: { color: 'rgba(255,255,255,0.07)' },
    },
  },
})

const ChartWrapper = ({ title, children }) => (
  <div className="bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-4 md:p-5 w-full overflow-hidden">
    <h3 className="text-white font-semibold mb-4 text-sm">{title}</h3>
    <div className="w-full h-[280px] touch-none">
      {children}
    </div>
  </div>
)

function HistoryCharts({ weatherData, airData }) {
  if (!weatherData || !airData) return null

  const labels = weatherData.time

  const airTimes = airData.time ?? []
  const airDailyLabels = airTimes.length
    ? [...new Set(airTimes.map((t) => t.split('T')[0]))]
    : []

  const aggregateDailyAir = (values, times) => {
    if (!values || !times) return []
    const dailyMap = {}
    times.forEach((t, i) => {
      const day = t.split('T')[0]
      if (!dailyMap[day]) dailyMap[day] = []
      if (values[i] != null) dailyMap[day].push(values[i])
    })
    return airDailyLabels.map((day) => {
      const arr = dailyMap[day]
      if (!arr || arr.length === 0) return null
      return parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
    })
  }

  const pm10Daily = aggregateDailyAir(airData.pm10, airTimes)
  const pm25Daily = aggregateDailyAir(airData.pm2_5, airTimes)

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 pb-12">

      <ChartWrapper title="Temperature Trends (°C)">
        <Line
          options={getOptions('Temperature (°C)')}
          data={{
            labels,
            datasets: [
              { label: 'Max', data: weatherData.temperature_2m_max, borderColor: 'rgb(248,113,113)', tension: 0.4, pointRadius: 0 },
              { label: 'Mean', data: weatherData.temperature_2m_mean, borderColor: 'rgb(250,204,21)', borderDash: [4, 4], tension: 0.4, pointRadius: 0 },
              { label: 'Min', data: weatherData.temperature_2m_min, borderColor: 'rgb(56,189,248)', tension: 0.4, pointRadius: 0 },
            ],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Total Precipitation (mm)">
        <Bar
          options={getOptions('Precipitation (mm)')}
          data={{
            labels,
            datasets: [
              { label: 'Precipitation', data: weatherData.precipitation_sum, backgroundColor: 'rgba(56,189,248,0.75)', borderRadius: 3 },
            ],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Sun Cycle — Sunrise & Sunset (IST)">
        <Line
          options={getOptions('Hour of Day', {
            label: (ctx) => {
              const h = Math.floor(ctx.raw)
              const m = Math.round((ctx.raw - h) * 60).toString().padStart(2, '0')
              return `${ctx.dataset.label}: ${h}:${m}`
            },
          })}
          data={{
            labels,
            datasets: [
              { label: 'Sunrise', data: weatherData.sunrise.map(timeToDecimal), borderColor: 'rgb(253,186,116)', backgroundColor: 'rgba(253,186,116,0.1)', fill: true, tension: 0.4, pointRadius: 0 },
              { label: 'Sunset', data: weatherData.sunset.map(timeToDecimal), borderColor: 'rgb(167,139,250)', backgroundColor: 'rgba(167,139,250,0.1)', fill: true, tension: 0.4, pointRadius: 0 },
            ],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Max Wind Speed & Dominant Direction">
        <Line
          options={{
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
                ticks: { color: 'rgba(255,255,255,0.5)', maxTicksLimit: 12 },
                grid: { color: 'rgba(255,255,255,0.07)' },
              },
              ySpeed: {
                type: 'linear',
                position: 'left',
                title: { display: true, text: 'Speed (km/h)', color: 'rgba(255,255,255,0.5)' },
                ticks: { color: 'rgba(255,255,255,0.5)' },
                grid: { color: 'rgba(255,255,255,0.07)' },
              },
              yDir: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 360,
                title: { display: true, text: 'Direction (°)', color: 'rgba(255,255,255,0.5)' },
                ticks: {
                  color: 'rgba(255,255,255,0.5)',
                  callback: (v) => `${v}°`,
                },
                grid: { drawOnChartArea: false },
              },
            },
          }}
          data={{
            labels,
            datasets: [
              {
                label: 'Max Wind Speed',
                data: weatherData.wind_speed_10m_max,
                borderColor: 'rgb(167,139,250)',
                tension: 0.4,
                pointRadius: 0,
                yAxisID: 'ySpeed',
              },
              {
                label: 'Wind Direction',
                data: weatherData.wind_direction_10m_dominant,
                borderColor: 'rgba(251,191,36,0.7)',
                borderDash: [4, 4],
                tension: 0,
                pointRadius: 0,
                yAxisID: 'yDir',
              },
            ],
          }}
        />
      </ChartWrapper>

      <ChartWrapper title="Air Quality — PM10 & PM2.5 (Daily Avg)">
        <Line
          options={getOptions('Concentration (μg/m³)')}
          data={{
            labels: airDailyLabels,
            datasets: [
              { label: 'PM10', data: pm10Daily, borderColor: 'rgb(251,146,60)', tension: 0.3, pointRadius: 0 },
              { label: 'PM2.5', data: pm25Daily, borderColor: 'rgb(244,63,94)', tension: 0.3, pointRadius: 0 },
            ],
          }}
        />
      </ChartWrapper>

    </div>
  )
}

export default HistoryCharts
