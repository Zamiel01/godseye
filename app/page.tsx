"use client"

import { useState, useEffect } from "react"
import { LoadingScreen } from "@/components/loading-screen"
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
    <>
      <div className={`min-h-screen transition-opacity duration-500 ${isAppLoaded ? "opacity-100" : "opacity-0"}`}>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #0f1419 0%, #1a365d 100%)",
          color: "#e8eaed",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
        }}
      >
        <div className="w-full">
          {/* Main content container with proper responsive padding */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
            <div className="space-y-8 sm:space-y-12 lg:space-y-16">
              <Header />
              <StatsSection />
              <div className="space-y-8 sm:space-y-12">
                <PasswordChecker />
                <BreachSearch />
              </div>
              <NewsSection />
            </div>
          </div>
          <Footer />
</div>
      </div>
    </div>
    </>
  )
}
