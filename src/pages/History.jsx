import { useState } from 'react'
import { useHistoryWeather } from '../customhooks/useHistoryWeather'
import HistoryCharts from '../components/HistoryCharts'
import HistorySkeleton from '../components/HistorySkeleton'

function History({ lat, long }) {
  const todayObj = new Date()
  const today = todayObj.toLocaleDateString('en-CA')

  // Archive API lags ~5 days behind real-time
  const archiveMaxObj = new Date()
  archiveMaxObj.setDate(todayObj.getDate() - 5)
  const archiveMax = archiveMaxObj.toLocaleDateString('en-CA')

  const twoYearsAgoObj = new Date()
  twoYearsAgoObj.setFullYear(todayObj.getFullYear() - 2)
  const twoYearsAgo = twoYearsAgoObj.toLocaleDateString('en-CA')

  const defaultStartObj = new Date()
  defaultStartObj.setDate(todayObj.getDate() - 30)
  const defaultStart = defaultStartObj.toLocaleDateString('en-CA')

  const [startDate, setStartDate] = useState(defaultStart)
  const [endDate, setEndDate] = useState(archiveMax)
  const [pendingStart, setPendingStart] = useState(defaultStart)
  const [pendingEnd, setPendingEnd] = useState(archiveMax)
  const [rangeError, setRangeError] = useState('')

  const { weatherState, airState, isLoading, error } = useHistoryWeather(lat, long, startDate, endDate)

  const handleApply = () => {
    const start = new Date(pendingStart)
    const end = new Date(pendingEnd)
    const diffMs = end - start
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays > 730) {
      setRangeError('Maximum range is 2 years. Please adjust your dates.')
      return
    }
    if (diffDays < 1) {
      setRangeError('End date must be after start date.')
      return
    }
    setRangeError('')
    setStartDate(pendingStart)
    setEndDate(pendingEnd)
  }

  const isUnchanged = pendingStart === startDate && pendingEnd === endDate

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-slate-900 via-blue-900 to-black pt-24 pb-12 px-4 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-6xl">

        <div className="bg-black/30 backdrop-blur-md border border-white/20 rounded-3xl p-5 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Historical Analysis</h1>
              <p className="text-blue-200/70 text-sm">Select a date range (max 2 years) to view trends.</p>
            </div>

            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:items-end sm:gap-3">
                <div className="flex flex-col">
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1">Start Date</label>
                  <input
                    type="date"
                    value={pendingStart}
                    min={twoYearsAgo}
                    max={pendingEnd}
                    onChange={(e) => { setPendingStart(e.target.value); setRangeError('') }}
                    className="bg-black/50 text-white border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-white/60 text-xs uppercase tracking-wider mb-1">End Date</label>
                  <input
                    type="date"
                    value={pendingEnd}
                    min={pendingStart}
                    max={archiveMax}
                    onChange={(e) => { setPendingEnd(e.target.value); setRangeError('') }}
                    className="bg-black/50 text-white border border-white/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 w-full"
                  />
                </div>

                <button
                  onClick={handleApply}
                  disabled={isUnchanged}
                  className="col-span-2 sm:col-span-1 bg-blue-500 hover:bg-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition text-white text-sm font-medium px-5 py-2 rounded-lg sm:self-end"
                >
                  Apply
                </button>
              </div>

              {rangeError && (
                <p className="text-red-400 text-xs">{rangeError}</p>
              )}
            </div>
          </div>
        </div>

        {isLoading && <HistorySkeleton />}

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-xl text-center text-sm">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <HistoryCharts
            weatherData={weatherState?.daily}
            airData={airState?.hourly}
          />
        )}

      </div>
    </div>
  )
}

export default History
