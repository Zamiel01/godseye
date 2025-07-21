"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { Navigation } from "@/components/navigation"
import { Header } from "@/components/header"
import { StatsSection } from "@/components/stats-section"
import { PasswordChecker } from "@/components/password-checker"
import { BreachSearch } from "@/components/breach-search"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAppLoaded, setIsAppLoaded] = useState(false)

  useEffect(() => {
    // Initialize the application
    const initializeApp = async () => {
      // Simulate API initialization and wake-up process
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setIsLoading(false)
      setTimeout(() => {
        setIsAppLoaded(true)
      }, 500)
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isAppLoaded ? "opacity-100" : "opacity-0"}`}>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #0f1419 0%, #1a365d 100%)",
          color: "#e8eaed",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        }}
      >
        <Navigation />

        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-8 min-h-[calc(100vh-80px)] flex flex-col">
          <Header />
          <StatsSection />
          <PasswordChecker />
          <BreachSearch />
          <NewsSection />
          <Footer />
        </div>
      </div>
    </div>
  )
}
