# WeatherScope

A responsive weather dashboard built with React. Shows current conditions, hourly forecasts, and up to 2 years of historical data — all pulled from the Open-Meteo API using your browser's GPS.

## Pages

**Today** — current weather for your location or any date you pick. Shows temperature, precipitation, wind, UV index, humidity, sunrise/sunset, and a full air quality breakdown (AQI, PM10, PM2.5, CO, CO2, NO2, SO2). Below that, six hourly charts cover temperature (with °C/°F toggle), humidity, precipitation, visibility, wind speed, and air quality.

**History** — pick a date range up to 2 years back and get trend charts for temperature (min/mean/max), precipitation, sun cycle, wind speed with dominant direction, and daily-averaged PM10/PM2.5. All charts support horizontal scroll and pinch/wheel zoom.

## Stack

- React 19 + Vite
- Tailwind CSS v4
- Chart.js + react-chartjs-2 + chartjs-plugin-zoom
- React Router v7
- [Open-Meteo](https://open-meteo.com) — free, no API key needed

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173` and allow location access when prompted.

```bash
npm run build    # production build
npm run preview  # preview the build locally
```

## Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Page 1 — current + hourly
│   └── History.jsx       # Page 2 — historical range
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── HourlyCharts.jsx
│   ├── HistoryCharts.jsx
│   ├── HomeSkeleton.jsx
│   └── HistorySkeleton.jsx
└── customhooks/
    ├── useWeather.js         # fetches forecast or archive based on date
    └── useHistoryWeather.js  # fetches historical range data
```

## Notes

- Past dates on Page 1 use the archive API automatically — no manual switching needed
- The archive API has a ~5 day lag, so the history page end date is capped accordingly
- Visibility data is only available for today/future dates (forecast API limitation)
- Location is detected once on load via `navigator.geolocation`
