import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navClass = ({ isActive }) =>
    isActive
      ? 'text-blue-300 border-b-2 border-blue-300 pb-0.5'
      : 'text-white/80 hover:text-white transition'

  return (
    <header className="w-full absolute top-0 z-50 px-6 py-4 flex justify-between items-center text-white backdrop-blur-sm bg-black/10 border-b border-white/10">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">W</div>
        <span className="text-lg font-bold tracking-wide">WeatherScope</span>
      </div>

      <nav className="hidden md:flex gap-8 font-medium">
        <NavLink to="/" end className={navClass}>Today</NavLink>
        <NavLink to="/history" className={navClass}>History</NavLink>
      </nav>

      <button
        className="md:hidden text-white"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-xl border-b border-white/10 flex flex-col items-center py-4 gap-1 md:hidden">
          <NavLink to="/" end onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `w-full text-center py-4 text-lg font-medium ${isActive ? 'text-blue-300' : 'text-white/80'}`}>Today</NavLink>
          <NavLink to="/history" onClick={() => setIsMenuOpen(false)} className={({ isActive }) => `w-full text-center py-4 text-lg font-medium ${isActive ? 'text-blue-300' : 'text-white/80'}`}>History</NavLink>
        </div>
      )}
    </header>
  )
}

export default Header
