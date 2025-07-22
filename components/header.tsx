export function Header() {
  return (
    <header className="text-center mb-8 sm:mb-12 animate-fade-in-down px-4">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-lg animate-pulse relative overflow-hidden flex-shrink-0"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            borderColor: "#1a365d",
            boxShadow: "0 0 0 2px white",
          }}
        >
          <svg 
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" 
            viewBox="0 0 30 30" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 2L4 7V14C4 20 8 25 15 28C22 25 26 20 26 14V7L15 2Z"
              fill="#1a365d"
              stroke="white"
              strokeWidth="2"
            />
            <ellipse cx="15" cy="15" rx="8" ry="5" fill="white" />
            <circle cx="15" cy="15" r="3" fill="#1a365d" />
            <circle cx="15" cy="15" r="1.5" fill="white" />
          </svg>
        </div>
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center sm:text-left"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Gods Eye
        </h1>
      </div>
      <div className="max-w-4xl mx-auto">
        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-3 sm:mb-4">
          Advanced Data Breach Intelligence
        </p>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Protect your digital identity by checking if your information has been compromised in known data breaches.
        </p>
      </div>
    </header>
  )
}
