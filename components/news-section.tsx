"use client"

import { useState, useEffect } from "react"

interface NewsArticle {
  title: string
  description: string
  url: string
  urlToImage?: string
  publishedAt: string
  author?: string
  content?: string
  source: {
    id?: string
    name: string
  }
}

interface NewsApiResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

type SeverityFilter = "all" | "critical" | "high" | "medium" | "low"

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentFilter, setCurrentFilter] = useState<SeverityFilter>("all")
  const [totalPages, setTotalPages] = useState(1)

  const articlesPerPage = 6

  // Function to determine article severity
  const getArticleSeverity = (title: string, description: string): SeverityFilter => {
    const text = (title + " " + description).toLowerCase()

    const criticalKeywords = [
      "zero-day",
      "critical vulnerability",
      "nation-state",
      "apt",
      "ransomware",
      "data breach",
      "supply chain attack",
      "critical infrastructure",
    ]
    const highKeywords = [
      "hack",
      "attack",
      "malware",
      "exploit",
      "vulnerability",
      "breach",
      "trojan",
      "botnet",
      "cyber attack",
    ]
    const mediumKeywords = ["security", "phishing", "scam", "leak", "exposed", "compromised", "threat", "incident"]

    if (criticalKeywords.some((keyword) => text.includes(keyword))) return "critical"
    if (highKeywords.some((keyword) => text.includes(keyword))) return "high"
    if (mediumKeywords.some((keyword) => text.includes(keyword))) return "medium"
    return "low"
  }

  // Function to generate tags
  const generateTags = (title: string, description: string): string[] => {
    const text = (title + " " + description).toLowerCase()
    const tags: string[] = []

    const tagKeywords: Record<string, string[]> = {
      "Zero-Day": ["zero-day", "zero day", "0-day"],
      APT: ["apt", "advanced persistent threat", "nation-state", "state-sponsored"],
      Ransomware: ["ransomware", "ransom", "lockbit", "conti", "ryuk"],
      "Data Breach": ["breach", "leak", "exposed", "compromised data"],
      Malware: ["malware", "virus", "trojan", "backdoor", "rootkit"],
      Vulnerability: ["vulnerability", "cve", "exploit", "security flaw"],
      Phishing: ["phishing", "spear phishing", "business email compromise"],
      Critical: ["critical", "emergency", "urgent", "immediate"],
    }

    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((keyword) => text.includes(keyword))) {
        tags.push(tag)
      }
    })

    return tags.slice(0, 3)
  }

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Function to generate placeholder image
  const generatePlaceholderImage = (title: string, description: string) => {
    const text = (title + " " + description).toLowerCase()

    const imageCategories: Record<string, { gradient: string; icon: string }> = {
      cybersecurity: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "🛡️" },
      breach: { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", icon: "🚨" },
      ransomware: { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", icon: "🔒" },
      malware: { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", icon: "🦠" },
      phishing: { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", icon: "🎣" },
      vulnerability: { gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", icon: "⚠️" },
    }

    for (const [category, config] of Object.entries(imageCategories)) {
      if (text.includes(category) || text.includes(category.replace("cybersecurity", "security"))) {
        return config
      }
    }

    return { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "📰" }
  }

  // Fallback news data
  const getFallbackNews = (): NewsArticle[] => [
    {
      source: { name: "CyberSecurity News" },
      title: "MOVEit Transfer Zero-Day Exploited in Mass Data Breach Campaign",
      description:
        "The Clop ransomware group has exploited a critical zero-day vulnerability in MOVEit Transfer software, affecting hundreds of organizations including major corporations and government agencies worldwide.",
      url: "https://example.com/news1",
      publishedAt: new Date().toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Cybersecurity+News",
    },
    {
      source: { name: "Breach Report" },
      title: "23andMe Data Breach Exposes 6.9 Million User Profiles",
      description:
        "Genetic testing company 23andMe confirms that hackers accessed personal information of 6.9 million users through credential stuffing attacks, exposing ancestry and health data.",
      url: "https://example.com/news2",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Data+Breach+Alert",
    },
    {
      source: { name: "Ransomware Tracker" },
      title: "BlackCat Ransomware Gang Hits MGM Resorts with $100M Demand",
      description:
        "The BlackCat (ALPHV) ransomware group has successfully breached MGM Resorts' systems, causing widespread outages across Las Vegas casinos and demanding $100 million ransom.",
      url: "https://example.com/news3",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Ransomware+Attack",
    },
    {
      source: { name: "Threat Intelligence" },
      title: "Lazarus Group Steals $200M in Cryptocurrency Exchange Hack",
      description:
        "North Korean state-sponsored hacking group Lazarus has stolen over $200 million from multiple cryptocurrency exchanges using sophisticated social engineering and malware attacks.",
      url: "https://example.com/news4",
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Crypto+Hack",
    },
    {
      source: { name: "Healthcare Security" },
      title: "HCA Healthcare Breach Affects 11 Million Patient Records",
      description:
        "One of America's largest hospital chains, HCA Healthcare, reports a massive data breach exposing personal and medical information of 11 million patients across 20 states.",
      url: "https://example.com/news5",
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Healthcare+Breach",
    },
    {
      source: { name: "Supply Chain Security" },
      title: "3CX Supply Chain Attack Affects 600,000 Companies Worldwide",
      description:
        "A sophisticated supply chain attack on 3CX's VoIP software has compromised over 600,000 companies globally, with attackers distributing malware through legitimate software updates.",
      url: "https://example.com/news6",
      publishedAt: new Date(Date.now() - 432000000).toISOString(),
      urlToImage: "/placeholder.svg?height=200&width=400&text=Supply+Chain+Attack",
    },
  ]

  // Filter articles
  const filterArticles = () => {
    let filtered = [...articles]

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((article) => {
        const searchText = (
          article.title +
          " " +
          article.description +
          " " +
          (article.source?.name || "")
        ).toLowerCase()
        return searchText.includes(query)
      })
    }

    // Apply severity filter
    if (currentFilter !== "all") {
      filtered = filtered.filter((article) => {
        const severity = getArticleSeverity(article.title, article.description)
        return severity === currentFilter
      })
    }

    setFilteredArticles(filtered)
    setTotalPages(Math.ceil(filtered.length / articlesPerPage))
    setCurrentPage(1)
  }



  // Load news
  useEffect(() => {
    const loadNews = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Get current date and date 30 days ago
        const today = new Date()
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        
        // Format date as YYYY-MM-DD
        const fromDate = thirtyDaysAgo.toISOString().split('T')[0]

        // Enhanced cybersecurity-focused query
        const query = encodeURIComponent(
          'cybersecurity OR "data breach" OR "cyber attack" OR "ransomware" OR "malware" OR "security vulnerability" OR "cyber security" OR "information security" OR "cyber threat" OR "zero-day"'
        );

        const response = await fetch(`https://gods-eye-api.onrender.com/api/everything?q=${query}&from=${fromDate}&sortBy=publishedAt&pageSize=30`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }

        const data: NewsApiResponse = await response.json()

        if (data.status === 'ok' && data.articles) {
          setArticles(data.articles)
          setFilteredArticles(data.articles)
          setTotalPages(Math.ceil(data.articles.length / articlesPerPage))
        } else {
          // If API fails, use fallback news
          const fallbackData = getFallbackNews()
          setArticles(fallbackData)
          setFilteredArticles(fallbackData)
          setTotalPages(Math.ceil(fallbackData.length / articlesPerPage))
        }
      } catch (err) {
        console.error("Error loading news:", err)
        // Use fallback news in case of error
        const fallbackData = getFallbackNews()
        setArticles(fallbackData)
        setFilteredArticles(fallbackData)
        setTotalPages(Math.ceil(fallbackData.length / articlesPerPage))
        setError("Using cached news due to connection issues. Please try again later for latest updates.")
      } finally {
        setIsLoading(false)
      }
    }

    loadNews()
  }, [])

  // Apply filters when search or filter changes
  useEffect(() => {
    filterArticles()
  }, [searchQuery, currentFilter, articles])

  // Get articles for current page
  const getCurrentPageArticles = () => {
    const startIndex = (currentPage - 1) * articlesPerPage
    const endIndex = startIndex + articlesPerPage
    return filteredArticles.slice(startIndex, endIndex)
  }

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      filterArticles()
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const today = new Date()
      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const fromDate = thirtyDaysAgo.toISOString().split('T')[0]

      // Combine user search with cybersecurity focus
      const cybersecurityContext = 'cybersecurity OR "cyber security" OR "information security"';
      const combinedQuery = encodeURIComponent(`(${searchQuery}) AND (${cybersecurityContext})`);
      
      const response = await fetch(
        `https://gods-eye-api.onrender.com/api/everything?q=${combinedQuery}&from=${fromDate}&sortBy=publishedAt&pageSize=30`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data: NewsApiResponse = await response.json()

      if (data.status === 'ok' && data.articles) {
        setArticles(data.articles)
        setFilteredArticles(data.articles)
        setTotalPages(Math.ceil(data.articles.length / articlesPerPage))
        setCurrentPage(1)
      }
    } catch (err) {
      console.error("Error searching news:", err)
      // Fall back to client-side filtering
      filterArticles()
    } finally {
      setIsLoading(false)
    }
  }

  // Handle filter change
  const handleFilterChange = (filter: SeverityFilter) => {
    setCurrentFilter(filter)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <section
        className="rounded-3xl p-6 sm:p-12 mb-12 border"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 border-4 border-t-white rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: "rgba(255, 255, 255, 0.1)", borderTopColor: "#ffffff" }}
          />
          <p className="text-gray-300">Loading latest security news...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section
        className="rounded-3xl p-6 sm:p-12 mb-12 border"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <p>❌ {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section
      className="rounded-3xl space-responsive mb-12 animate-fade-in-up border w-full overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            📰 Latest Security News
          </h2>
          <button
            onClick={() => {
              setSearchQuery('')
              setCurrentFilter('all')
              loadNews()
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-all duration-300"
            title="Refresh News"
          >
            🔄
          </button>
        </div>
        <p className="text-lg text-gray-300 mb-8">
          Stay informed about the latest data breaches, hacking incidents, and cybersecurity threats
        </p>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div
            className="flex items-center rounded-xl border-2 overflow-hidden transition-all duration-300 focus-within:border-white/30 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none"
              placeholder="Search cybersecurity news..."
            />
            <button
              onClick={handleSearch}
              className="px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              🔍
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                ✕
              </button>
            )}
          </div>
          {(searchQuery || currentFilter !== "all") && (
            <div className="text-sm text-gray-300 mt-2">
              {filteredArticles.length} of {articles.length} articles
              {searchQuery && ` matching "${searchQuery}"`}
              {currentFilter !== "all" && ` (${currentFilter} priority)`}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: "all" as SeverityFilter, label: "All News" },
            { id: "critical" as SeverityFilter, label: "Critical" },
            { id: "high" as SeverityFilter, label: "High Priority" },
            { id: "medium" as SeverityFilter, label: "Medium Priority" },
            { id: "low" as SeverityFilter, label: "Low Priority" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => handleFilterChange(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 ${
                currentFilter === filter.id
                  ? "bg-white text-blue-900 border-white"
                  : "text-gray-300 border-white/20 hover:border-white/40 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="responsive-grid mb-8">
        {getCurrentPageArticles().map((article, index) => {
          const severity = getArticleSeverity(article.title, article.description)
          const tags = generateTags(article.title, article.description)
          const formattedDate = formatDate(article.publishedAt)
          const imageInfo = generatePlaceholderImage(article.title, article.description)

          return (
            <div
              key={index}
              onClick={() => window.open(article.url, "_blank")}
              className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl border flex flex-col h-full ${
                severity === "critical"
                  ? "border-l-4 border-l-red-600"
                  : severity === "high"
                    ? "border-l-4 border-l-red-500"
                    : severity === "medium"
                      ? "border-l-4 border-l-yellow-500"
                      : "border-l-4 border-l-green-500"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderColor: "rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Image with Gradient Overlay */}
              <div className="relative">
                {article.urlToImage ? (
                  <>
                    <img
                      src={article.urlToImage || "/placeholder.svg"}
                      alt={article.title}
                      className="w-full h-56 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                        const placeholder = target.nextElementSibling as HTMLElement
                        if (placeholder) placeholder.style.display = "flex"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80"></div>
                  </>
                ) : (
                  <div
                    className="w-full h-56 sm:h-64 flex items-center justify-center text-5xl text-white"
                    style={{ background: imageInfo.gradient }}
                  >
                    {imageInfo.icon}
                  </div>
                )}
                
                {/* Source and Date - Overlaid on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between gap-3">
                  <span
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-white backdrop-blur-md"
                    style={{ background: "rgba(255, 255, 255, 0.1)" }}
                  >
                    {article.source.name}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl text-xs font-medium text-white backdrop-blur-md"
                    style={{ background: "rgba(0, 0, 0, 0.5)" }}>
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Priority Indicator */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    severity === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : severity === "high"
                        ? "bg-orange-500/20 text-orange-400"
                        : severity === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                  }`}>
                    {severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
                  </span>
                </div>

                {/* Title and Description */}
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 leading-tight hover:text-blue-400 transition-colors duration-300">
                  {article.title}
                </h3>

                <p className="text-base text-gray-300 mb-4 line-clamp-3 leading-relaxed flex-1">
                  {article.description}
                </p>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Read More Link */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-white text-sm font-medium flex items-center gap-2 hover:text-blue-400 transition-all duration-300 group-hover:translate-x-1"
                  >
                    Read Full Article 
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div
            className="flex items-center gap-2 p-2 rounded-full border"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border rounded-lg text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                title="First Page"
              >
                ⟪
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center border rounded-lg text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                title="Previous Page"
              >
                ‹
              </button>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                      currentPage === pageNum
                        ? "text-blue-900 hover:shadow-lg"
                        : "text-gray-300 hover:bg-white/10 hover:text-white hover:transform hover:-translate-y-1"
                    }`}
                    style={
                      currentPage === pageNum
                        ? {
                            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
                          }
                        : {}
                    }
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border rounded-lg text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                title="Next Page"
              >
                ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center border rounded-lg text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                title="Last Page"
              >
                ⟫
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-300 flex items-center gap-2">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <span>•</span>
            <span>{filteredArticles.length} articles</span>
          </div>
        </div>
      )}
    </section>
  )
}
