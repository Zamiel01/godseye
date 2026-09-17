"use client"

import { MobileNav } from "@/components/mobile-nav"
import { usePathname } from "next/navigation"
import Link from "next/link"

export function Navigation() {
  const pathname = usePathname()
  
  return (
    <nav
      className="sticky top-0 z-50 border-b border-[#263a40] bg-[#081216]/90 backdrop-blur-xl"
      style={{
        background: "rgba(8, 18, 22, 0.9)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 text-white no-underline font-extrabold tracking-tight text-lg sm:text-xl">
          <div
            className="icon-box w-9 h-9"
            style={{
              background: "#123933",
              color: "#54d6c3",
              borderColor: "#245a53",
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname === "/" 
                ? "bg-[#123933] text-[#54d6c3]"
                : "text-[#91a6aa] hover:bg-[#14262c] hover:text-white"
            }`}
            style={undefined}
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
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname === "/find-my-phone"
                ? "bg-[#123933] text-[#54d6c3]"
                : "text-[#91a6aa] hover:bg-[#14262c] hover:text-white"
            }`}
            style={undefined}
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
          <Link
            href="/temp-mail"
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              pathname === "/temp-mail"
                ? "bg-[#123933] text-[#54d6c3]"
                : "text-[#91a6aa] hover:bg-[#14262c] hover:text-white"
            }`}
            style={undefined}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Temp Mail
          </Link>
        </div>

        {/* GitHub Star */}
        <a
          href="https://github.com/Zamiel01/godseye"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Star God's Eye on GitHub"
          className="hidden md:flex"
        >
          <iframe
            src="https://ghbtns.com/github-btn.html?user=Zamiel01&repo=godseye&type=star&count=true&size=large"
            width="135"
            height="30"
            frameBorder="0"
            scrolling="0"
            title="Star God's Eye on GitHub"
          />
        </a>

        {/* Mobile Navigation */}
        <MobileNav />
      </div>
    </nav>
  )
}
