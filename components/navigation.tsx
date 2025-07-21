"use client"

import { useState } from "react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 mb-8"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
        <a href="#" className="flex items-center gap-3 text-white no-underline font-bold text-xl sm:text-2xl">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl border-2"
            style={{
              background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
              color: "#1a365d",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 2L4 7V14C4 20 8 25 15 28C22 25 26 20 26 14V7L15 2Z"
                fill="#1a365d"
                stroke="currentColor"
                strokeWidth="2"
              />
              <ellipse cx="15" cy="15" rx="8" ry="5" fill="currentColor" />
              <circle cx="15" cy="15" r="3" fill="#1a365d" />
              <circle cx="15" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </div>
          Gods Eye
        </a>

        <button
          className="md:hidden p-2 border-2 rounded-lg transition-all duration-300 hover:bg-white/10"
          style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 12H21M3 6H21M3 18H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <ul
          className={`${isMenuOpen ? "flex" : "hidden"} md:flex flex-col md:flex-row items-center gap-4 md:gap-8 absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto bg-inherit md:bg-transparent p-4 md:p-0 border-t md:border-t-0 border-white/10`}
        >
          <li>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 text-white border-2"
              style={{
                background: "#ffffff",
                borderColor: "#ffffff",
                color: "#1a365d",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Home
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
