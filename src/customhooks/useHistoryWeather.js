import { useEffect, useState } from 'react'

export function useHistoryWeather(userLat, userLong, startDate, endDate) {
  const [weatherState, setWeatherState] = useState(null)
  const [airState, setAirState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userLat || !userLong || !startDate || !endDate) return

    const fetchHisData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${userLat}&longitude=${userLong}&start_date=${startDate}&end_date=${endDate}&daily=sunrise,sunset,temperature_2m_mean,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,wind_direction_10m_dominant,precipitation_sum&timezone=auto`
        const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${userLat}&longitude=${userLong}&hourly=pm10,pm2_5&start_date=${startDate}&end_date=${endDate}&timezone=auto`

        const [weatherRes, airRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)])
        const [weather, air] = await Promise.all([weatherRes.json(), airRes.json()])

        setWeatherState(weather)
        setAirState(air)
      } catch (err) {
        setError('Failed to load historical weather data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHisData()
  }, [userLat, userLong, startDate, endDate])

  return { weatherState, airState, isLoading, error }
}
