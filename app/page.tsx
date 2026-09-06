"use client"

import { Header } from "@/components/header"
import { StatsSection } from "@/components/stats-section"
import { PasswordChecker } from "@/components/password-checker"
import { BreachSearch } from "@/components/breach-search"
import { NewsSection } from "@/components/news-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
      <div className="site-shell min-h-screen">
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-10 sm:py-16">
            <div className="space-y-10 sm:space-y-14">
              <Header />
              <StatsSection />
              <div id="security-tools" className="space-y-8 sm:space-y-10">
                <PasswordChecker />
                <BreachSearch />
              </div>
              <NewsSection />
            </div>
          </div>
          <Footer />
</div>
      </div>
  )
}
