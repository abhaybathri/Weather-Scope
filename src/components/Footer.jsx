function Footer() {
  return (
    <footer className="w-full py-3 px-6 bg-black/40 backdrop-blur-sm border-t border-white/10 text-center text-white/50 text-sm flex flex-wrap justify-center gap-1">
      <span>Powered by</span>
      <a
        href="https://open-meteo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300 transition"
      >
        Open-Meteo
      </a>
      <span>· Weather data is free &amp; open-source</span>
    </footer>
  )
}

export default Footer
