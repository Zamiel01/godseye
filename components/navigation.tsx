"use client"

import { MobileNav } from "@/components/mobile-nav"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav
      className="sticky top-0 z-50 mb-8 border-b backdrop-blur-xl"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
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
          God's Eye
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              pathname === "/" 
                ? "bg-white text-blue-900 border-2 border-white hover:bg-white/90"
                : "text-white hover:bg-white/10 border-2"
            }`}
            style={pathname !== "/" ? {
              borderColor: "rgba(255, 255, 255, 0.2)",
            } : undefined}
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
          </Link>
          <Link
            href="/find-my-phone"
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
              pathname === "/find-my-phone"
                ? "bg-white text-blue-900 border-2 border-white hover:bg-white/90"
                : "text-white hover:bg-white/10 border-2"
            }`}
            style={pathname !== "/find-my-phone" ? {
              borderColor: "rgba(255, 255, 255, 0.2)",
            } : undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 21C16 21 19 18 19 14C19 10 12 3 12 3C12 3 5 10 5 14C5 18 8 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Find My Phone
          </Link>
        </div>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  )
}
