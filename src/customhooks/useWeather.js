import { useEffect, useState } from 'react'

export function useWeather(userLat, userLong, selectedDate) {
  const [dailyWeatherState, setDailyWeatherState] = useState(null)
  const [airState, setAirState] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userLat || !userLong || !selectedDate) return

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      const todayStr = new Date().toLocaleDateString('en-CA') 
      const isPast = selectedDate < todayStr

      const weatherUrl = isPast
        ? `https://archive-api.open-meteo.com/v1/archive?latitude=${userLat}&longitude=${userLong}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`
        : `https://api.open-meteo.com/v1/forecast?latitude=${userLat}&longitude=${userLong}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,precipitation_sum&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m&current=temperature_2m,precipitation,relative_humidity_2m,weather_code&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`

      const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${userLat}&longitude=${userLong}&hourly=pm10,pm2_5,us_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,carbon_dioxide&current=pm10,pm2_5,us_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide&timezone=auto&start_date=${selectedDate}&end_date=${selectedDate}`

      try {
        const [weatherRes, airRes] = await Promise.all([fetch(weatherUrl), fetch(airUrl)])
        const [weather, air] = await Promise.all([weatherRes.json(), airRes.json()])
        weather._isPast = isPast
        setDailyWeatherState(weather)
        setAirState(air)
      } catch (err) {
        setError('Failed to load weather data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userLat, userLong, selectedDate])

  return { dailyWeatherState, airState, isLoading, error }
}
