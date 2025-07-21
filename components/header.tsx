export function Header() {
  return (
    <header className="text-center mb-12 animate-fade-in-down">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div
          className="w-12 h-12 sm:w-15 sm:h-15 rounded-full flex items-center justify-center text-3xl sm:text-4xl border-4 shadow-lg animate-pulse relative"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            borderColor: "#1a365d",
            boxShadow: "0 0 0 2px white",
          }}
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          className="text-4xl sm:text-5xl font-bold"
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
      <p className="text-lg sm:text-xl text-gray-300 mb-2">Advanced Data Breach Intelligence</p>
      <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
        Protect your digital identity by checking if your information has been compromised in known data breaches.
      </p>
    </header>
  )
}
