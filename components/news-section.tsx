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

interface HNHit {
  objectID: string
  title: string
  author: string
  url: string
  points: number
  num_comments: number
  created_at: string
  story_text?: string
  _highlightResult?: {
    title?: { value: string }
    story_text?: { value: string }
  }
}

interface HNSearchResponse {
  hits: HNHit[]
  nbHits: number
  page: number
  hitsPerPage: number
  processingTimeMS: number
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

  const mapHNHitToArticle = (hit: HNHit): NewsArticle => ({
    title: hit.title,
    description: hit._highlightResult?.story_text?.value
      ? hit._highlightResult.story_text.value.replace(/<[^>]*>/g, "").slice(0, 300)
      : hit.story_text ? hit.story_text.slice(0, 300) : `Posted by ${hit.author} · ${hit.points} points · ${hit.num_comments} comments`,
    url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
    urlToImage: `https://picsum.photos/seed/${encodeURIComponent(hit.title || hit.objectID).slice(0, 20)}/600/400`,
    publishedAt: new Date(hit.created_at).toISOString(),
    author: hit.author,
    content: hit.story_text,
    source: { name: "HackerNews" },
  })

  const getArticleSeverity = (title: string, description: string): SeverityFilter => {
    const text = (title + " " + description).toLowerCase()
    const criticalKeywords = ["zero-day", "critical vulnerability", "nation-state", "apt", "ransomware", "data breach", "supply chain attack", "critical infrastructure"]
    const highKeywords = ["hack", "attack", "malware", "exploit", "vulnerability", "breach", "trojan", "botnet", "cyber attack"]
    const mediumKeywords = ["security", "phishing", "scam", "leak", "exposed", "compromised", "threat", "incident"]
    if (criticalKeywords.some((k) => text.includes(k))) return "critical"
    if (highKeywords.some((k) => text.includes(k))) return "high"
    if (mediumKeywords.some((k) => text.includes(k))) return "medium"
    return "low"
  }

  const generateTags = (title: string, description: string): string[] => {
    const text = (title + " " + description).toLowerCase()
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
    const tags: string[] = []
    Object.entries(tagKeywords).forEach(([tag, keywords]) => {
      if (keywords.some((k) => text.includes(k))) tags.push(tag)
    })
    return tags.slice(0, 3)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((now.getTime() - date.getTime()) / 86400000)
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getTimeAgoLabel = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMin = Math.floor((now.getTime() - date.getTime()) / 60000)
    if (diffMin < 60) return `${diffMin}m ago`
    const diffHr = Math.floor(diffMin / 60)
    if (diffHr < 24) return `${diffHr}h ago`
    return formatDate(dateString)
  }

  const getPlaceholderInfo = (title: string, description: string) => {
    const text = (title + " " + description).toLowerCase()
    const categories: Record<string, { gradient: string; icon: string }> = {
      cybersecurity: { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "🛡️" },
      breach: { gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", icon: "🚨" },
      ransomware: { gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", icon: "🔒" },
      malware: { gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", icon: "🦠" },
      phishing: { gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", icon: "🎣" },
      vulnerability: { gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", icon: "⚠️" },
    }
    for (const [key, config] of Object.entries(categories)) {
      if (text.includes(key) || text.includes(key.replace("cybersecurity", "security"))) return config
    }
    return { gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", icon: "📰" }
  }

  const getFallbackNews = (): NewsArticle[] => [
    {
      source: { name: "HackerNews" },
      title: "Show HN: I built a privacy-focused email forwarding service",
      description: "A new open-source tool that lets you receive emails without revealing your real address. Built with Next.js and Firebase.",
      url: "#",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "dev_dude",
    },
    {
      source: { name: "HackerNews" },
      title: "Critical: OpenSSL 3.x vulnerability allows remote code execution",
      description: "A severe buffer overflow vulnerability has been discovered in OpenSSL 3.x affecting millions of servers worldwide. Patch immediately.",
      url: "#",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "sec_researcher",
    },
    {
      source: { name: "HackerNews" },
      title: "How a $10 Raspberry Pi Zero can crack your WiFi password",
      description: "Security researcher demonstrates a new WiFi cracking tool that runs on the cheapest Raspberry Pi model, using parallel processing.",
      url: "#",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "net_hacker",
    },
    {
      source: { name: "HackerNews" },
      title: "Ask HN: Best practices for managing 500+ API keys securely?",
      description: "Looking for recommendations on secrets management at scale. Currently evaluating HashiCorp Vault, AWS Secrets Manager, and Doppler.",
      url: "#",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "ops_eng",
    },
    {
      source: { name: "HackerNews" },
      title: "New malware targeting Linux servers via SSH brute-force",
      description: "A new strain of malware has been infecting Linux servers through SSH brute-force attacks, installing cryptomining software silently.",
      url: "#",
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "linux_sec",
    },
    {
      source: { name: "HackerNews" },
      title: "PostgreSQL 17 introduces built-in audit logging for compliance",
      description: "The new release of PostgreSQL comes with native audit logging features, making it easier to meet regulatory requirements without third-party tools.",
      url: "#",
      publishedAt: new Date(Date.now() - 43200000).toISOString(),
      urlToImage: undefined,  // TODO: set in mapper
      author: "db_admin",
    },
  ]

  const filterArticles = () => {
    let filtered = [...articles]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((a) => {
        const searchText = `${a.title} ${a.description} ${a.source?.name || ""}`.toLowerCase()
        return searchText.includes(query)
      })
    }
    if (currentFilter !== "all") {
      filtered = filtered.filter((a) => getArticleSeverity(a.title, a.description) === currentFilter)
    }
    setFilteredArticles(filtered)
    setTotalPages(Math.ceil(filtered.length / articlesPerPage))
    setCurrentPage(1)
  }

  const fetchNews = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const oneDayAgo = Math.floor(Date.now() / 1000) - 86400
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=30&numericFilters=created_at_i>${oneDayAgo}&restrictSearchableAttributes=title,url`,
        { next: { revalidate: 300 } }
      )
      if (!res.ok) throw new Error("HN Algolia returned " + res.status)
      const data: HNSearchResponse = await res.json()
      if (data.hits.length > 0) {
        const mapped = data.hits.map(mapHNHitToArticle)
        setArticles(mapped)
        setFilteredArticles(mapped)
        setTotalPages(Math.ceil(mapped.length / articlesPerPage))
      } else {
        const fallback = getFallbackNews()
        setArticles(fallback)
        setFilteredArticles(fallback)
        setTotalPages(Math.ceil(fallback.length / articlesPerPage))
      }
    } catch (err) {
      console.error("Error loading news:", err)
      const fallback = getFallbackNews()
      setArticles(fallback)
      setFilteredArticles(fallback)
      setTotalPages(Math.ceil(fallback.length / articlesPerPage))
      setError("Using curated tech news (HN Algolia unavailable).")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchNews() }, [])
  useEffect(() => { filterArticles() }, [searchQuery, currentFilter, articles])

  const handleSearch = async () => {
    if (!searchQuery.trim()) { filterArticles(); return }
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=30&restrictSearchableAttributes=title,url&query=${encodeURIComponent(searchQuery)}`
      )
      if (!res.ok) throw new Error()
      const data: HNSearchResponse = await res.json()
      if (data.hits.length > 0) {
        const mapped = data.hits.slice(0, 30).map(mapHNHitToArticle)
        setArticles(mapped)
        setFilteredArticles(mapped)
        setTotalPages(Math.ceil(mapped.length / articlesPerPage))
      }
    } catch {
      filterArticles()
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <section className="rounded-3xl p-6 sm:p-12 mb-12 border" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-white rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "rgba(255,255,255,0.1)", borderTopColor: "#ffffff" }} />
          <p className="text-gray-300">Loading latest stories…</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-3xl p-6 sm:p-12 mb-12 border" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderColor: "rgba(255,255,255,0.1)" }}>
        <div className="text-center p-8 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          <p>ℹ️ {error}</p>
        </div>
      </section>
    )
  }

  const getCurrentPageArticles = () => {
    const start = (currentPage - 1) * articlesPerPage
    return filteredArticles.slice(start, start + articlesPerPage)
  }

  return (
    <section className="rounded-3xl space-responsive mb-12 animate-fade-in-up border w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderColor: "rgba(255,255,255,0.1)" }}>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">📰 Tech & Cybersecurity Stories</h2>
          <button onClick={fetchNews} className="p-2 rounded-full hover:bg-white/10 transition-all duration-300" title="Refresh">🔄</button>
        </div>
        <p className="text-lg text-gray-300 mb-8">Top stories from HackerNews — the latest in tech, security, and hacking</p>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center rounded-xl border-2 overflow-hidden transition-all duration-300 focus-within:border-white/30 shadow-lg" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-400 outline-none" placeholder="Search stories…" />
            <button onClick={handleSearch} className="px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10">🔍</button>
            {searchQuery && <button onClick={() => setSearchQuery("")} className="px-4 py-4 text-gray-300 hover:text-white hover:bg-white/10">✕</button>}
          </div>
          {(searchQuery || currentFilter !== "all") && (
            <p className="text-sm text-gray-300 mt-2">{filteredArticles.length} of {articles.length} stories</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {(["all", "critical", "high", "medium", "low"] as SeverityFilter[]).map((f) => (
            <button key={f} onClick={() => setCurrentFilter(f)} className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-300 ${currentFilter === f ? "bg-white text-blue-900 border-white" : "text-gray-300 border-white/20 hover:border-white/40 hover:text-white"}`}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
      </div>

      <div className="responsive-grid mb-8">
        {getCurrentPageArticles().map((article, index) => {
          const severity = getArticleSeverity(article.title, article.description)
          const tags = generateTags(article.title, article.description)
          const placeholderInfo = getPlaceholderInfo(article.title, article.description)
          return (
            <div key={article.url + index} onClick={() => window.open(article.url, "_blank")} className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl border flex flex-col h-full ${severity === "critical" ? "border-l-4 border-l-red-600" : severity === "high" ? "border-l-4 border-l-red-500" : severity === "medium" ? "border-l-4 border-l-yellow-500" : "border-l-4 border-l-green-500"}`} style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.1)" }}>
              {article.urlToImage && <img src={article.urlToImage} alt={article.title} className="w-full h-56 object-cover" />}
              {!article.urlToImage && (
                <div className="w-full h-56 flex items-center justify-center text-5xl text-white" style={{ background: placeholderInfo.gradient }}>
                  {placeholderInfo.icon}
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <span className={`px-3 py-1 rounded-full text-xs font-medium mb-3 self-start ${severity === "critical" ? "bg-red-500/20 text-red-400" : severity === "high" ? "bg-orange-500/20 text-orange-400" : severity === "medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>{severity.charAt(0).toUpperCase() + severity.slice(1)} Priority</span>
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 hover:text-blue-400">{article.title}</h3>
                <p className="text-base text-gray-300 mb-4 line-clamp-3 flex-1">{article.description}</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((t, i) => <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-gray-300">{t}</span>)}
                  </div>
                )}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-white text-sm font-medium hover:text-blue-400">Read Full Article →</a>
                  <span className="text-xs text-gray-500">{getTimeAgoLabel(article.publishedAt)}</span>
                </div>
                <span className="text-xs text-gray-600 mt-2">From {article.source.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 p-2 rounded-full border" style={{ background: "rgba(255,255,255,0.05)", borderColor: "rgba(255,255,255,0.1)" }}>
            <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 disabled:opacity-30">⟪</button>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 disabled:opacity-30">‹</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all ${
                      currentPage === pageNum ? "text-blue-900" : "text-gray-300 hover:bg-white/10"
                    }`}
                    style={currentPage === pageNum ? { background: "linear-gradient(45deg,#fff,#f0f4f8)" } : {}}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 disabled:opacity-30">›</button>
            <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/10 disabled:opacity-30">⟫</button>
          </div>
          <span className="text-sm text-gray-300">Page {currentPage} of {totalPages}</span>
        </div>
      )}
    </section>
  )
}