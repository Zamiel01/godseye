"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { AlertTriangle, CalendarDays, CheckCircle2, Database, Github, Mail, Search, ShieldCheck, Star, X } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const GITHUB_REPO_URL = "https://github.com/your-org/gods-eye"
const STAR_PROMPT_STORAGE_KEY = "xon:github-star-prompt"
const STAR_PROMPT_DELAY_MS = 900

interface BreachDetail {
  breach?: string
  details?: string
  domain?: string
  industry?: string
  password_risk?: string
  xposed_data?: string
  xposed_date?: string
  xposed_records?: number
}

interface XposedResponse {
  status?: string
  Error?: string
  breaches?: string[][]
  BreachMetrics?: {
    risk?: Array<{ risk_label?: string; risk_score?: number }>
    xposed_data?: Array<{ children?: Array<{ name?: string; children?: Array<{ name?: string }> }> }>
  } | null
  ExposedBreaches?: { breaches_details?: BreachDetail[] } | null
}

type SearchResult = {
  type: "success" | "danger"
  title: string
  message: string
  breaches: BreachDetail[]
  riskLabel?: string
  riskScore?: number
  exposedData: string[]
}

function readDismissed() {
  try {
    return localStorage.getItem(STAR_PROMPT_STORAGE_KEY) === "dismissed"
  } catch {
    return false
  }
}

function writeDismissed() {
  try {
    localStorage.setItem(STAR_PROMPT_STORAGE_KEY, "dismissed")
  } catch {
    // Private browsing: the prompt will simply show again next session.
  }
}

function GitHubStarPrompt({ onClose }: { onClose: () => void }) {
  const [hovered, setHovered] = useState(0)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const handleStar = () => {
    trackEvent("github-star-prompt-accepted")
    writeDismissed()
    window.open(GITHUB_REPO_URL, "_blank", "noopener,noreferrer")
    onClose()
  }

  const handleDismiss = () => {
    trackEvent("github-star-prompt-dismissed")
    writeDismissed()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-star-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) handleDismiss()
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-[#263a40] bg-[#101d22] p-6 shadow-2xl animate-fade-in-up">
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-[#667f83] transition hover:text-white"
        >
          <X size={18} />
        </button>

        <span className="icon-box mb-4 flex h-11 w-11 items-center justify-center"><Github size={20} /></span>

        <h3 id="github-star-title" className="text-xl font-extrabold tracking-tight text-white">
          Enjoying God&apos;s Eye?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#91a6aa]">
          Your scan is done. If this tool was useful, a star on GitHub helps other people find it.
        </p>

        <div className="mt-5 flex items-center justify-center gap-1" onMouseLeave={() => setHovered(0)}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-label={`Rate ${value} out of 5`}
              onMouseEnter={() => setHovered(value)}
              onClick={handleStar}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={value <= hovered ? "text-[#f5c451]" : "text-[#2c4249]"}
                fill={value <= hovered ? "#f5c451" : "none"}
              />
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={handleStar} className="primary-button flex-1 rounded-lg px-5 py-3 font-bold">
            Star on GitHub
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 rounded-lg border border-[#263a40] px-5 py-3 font-semibold text-[#91a6aa] transition hover:text-white"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

export function BreachSearch() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [showStarPrompt, setShowStarPrompt] = useState(false)
  const promptTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (promptTimer.current) clearTimeout(promptTimer.current)
    }
  }, [])

  // Fires only after a real search round-trip, never on client-side validation errors.
  const finishSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("tool-completed"))
    if (readDismissed()) return
    if (promptTimer.current) clearTimeout(promptTimer.current)
    promptTimer.current = setTimeout(() => {
      setShowStarPrompt(true)
      trackEvent("github-star-prompt-shown")
    }, STAR_PROMPT_DELAY_MS)
  }, [])

  const extractExposedData = (data: XposedResponse) => {
    const direct = data.ExposedBreaches?.breaches_details?.flatMap((breach) =>
      (breach.xposed_data || "").split(";").map((item) => item.trim()).filter(Boolean),
    ) || []
    const nested = data.BreachMetrics?.xposed_data?.flatMap((group) =>
      group.children?.flatMap((child) => [child.name, ...(child.children?.map((item) => item.name) || [])].filter(Boolean) as string[]) || [],
    ) || []
    return Array.from(new Set([...direct, ...nested])).slice(0, 8)
  }

  const getCacheKey = async (value: string) => {
    const bytes = new TextEncoder().encode(value)
    const digest = await crypto.subtle.digest("SHA-256", bytes)
    const hash = Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("")
    return `xon:analytics:${hash}`
  }

  const runSearch = async (value: string) => {
    setIsLoading(true)
    setResult(null)
    setShowStarPrompt(false)
    trackEvent("breach-search-started")

    try {
      const normalizedEmail = value.trim().toLowerCase()
      const cacheKey = await getCacheKey(normalizedEmail)
      let analytics: XposedResponse | null = null

      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) analytics = JSON.parse(cached) as XposedResponse
      } catch {
        analytics = null
      }

      if (!analytics) {
        const analyticsResponse = await fetch(
          `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(normalizedEmail)}`,
        )
        if (analyticsResponse.status === 429) throw new Error("RATE_LIMIT")
        if (!analyticsResponse.ok) throw new Error("API_ERROR")
        analytics = await analyticsResponse.json() as XposedResponse
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(analytics))
        } catch {
          // Storage may be unavailable in private browsing; the API result still works.
        }
      }

      const breaches = analytics.ExposedBreaches?.breaches_details || []
      const hasBreaches = breaches.length > 0 || Boolean(analytics.BreachMetrics)

      if (!hasBreaches) {
        trackEvent("breach-search-completed", "Breach search found no exposure")
        setResult({
          type: "success",
          title: "No exposure found",
          message: "XposedOrNot did not find this email address in its indexed breach data.",
          breaches: [],
          exposedData: [],
        })
        return
      }

      const risk = analytics.BreachMetrics?.risk?.[0]

      setResult({
        type: "danger",
        title: "Exposure found",
        message: `This email appears in ${breaches.length || "one or more"} known breach${breaches.length === 1 ? "" : "es"}. Review the details below and secure affected accounts.`,
        breaches,
        riskLabel: risk?.risk_label,
        riskScore: risk?.risk_score,
        exposedData: extractExposedData(analytics),
      })
      trackEvent("breach-search-completed", "Breach search found exposure")
    } catch (error) {
      const message = error instanceof Error && error.message === "RATE_LIMIT"
        ? "The free API rate limit was reached. Please wait a moment and try again."
        : "XposedOrNot is temporarily unavailable. Please try again later."
      setResult({ type: "danger", title: "Search unavailable", message, breaches: [], exposedData: [] })
    } finally {
      setIsLoading(false)
      finishSearch()
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      setResult({ type: "danger", title: "Enter a valid email", message: "Use an email address such as name@example.com.", breaches: [], exposedData: [] })
      return
    }
    runSearch(email)
  }

  return (
    <section className="surface-card p-6 sm:p-10 animate-fade-in-up" style={{ background: "rgba(16, 29, 34, 0.92)" }}>
      <div className="mb-6 flex items-center gap-3">
        <span className="icon-box h-11 w-11"><Search /></span>
        <span className="eyebrow">Exposure search</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">Check your email exposure</h2>
      <p className="max-w-2xl text-base text-[#91a6aa] mb-8">
        Search billions of exposed records through XposedOrNot&apos;s free public API. No API key or account is required.
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <label htmlFor="breach-email" className="mb-2 block text-sm font-semibold text-white">Email address</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#667f83]" size={18} />
            <input
              id="breach-email"
              type="email"
              value={email}
              onChange={(event) => { setEmail(event.target.value); setResult(null) }}
              className="w-full rounded-lg border border-[#263a40] bg-[#0b171b] py-4 pl-11 pr-4 text-white outline-none transition focus:border-[#54d6c3]"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <button type="submit" disabled={isLoading} className="primary-button rounded-lg px-6 py-4 font-bold disabled:opacity-60">
            {isLoading ? "Checking..." : "Check exposure"}
          </button>
        </div>
      </form>

      {result && (
        <div className={`mt-8 rounded-xl border p-5 ${result.type === "success" ? "border-[#245a53] bg-[#123933]/50" : "border-[#713936] bg-[#321b1c]/60"}`}>
          <div className="flex items-start gap-3">
            {result.type === "success" ? <CheckCircle2 className="mt-0.5 shrink-0 text-[#54d6c3]" /> : <AlertTriangle className="mt-0.5 shrink-0 text-[#ff766f]" />}
            <div>
              <h3 className="font-bold text-white">{result.title}</h3>
              <p className="mt-1 text-sm leading-6 text-[#91a6aa]">{result.message}</p>
            </div>
          </div>

          {result.type === "danger" && (
            <div className="mt-6 space-y-5">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[#263a40] bg-[#0b171b] p-4"><div className="text-xl font-bold text-white">{result.breaches.length || "—"}</div><div className="mt-1 text-xs text-[#91a6aa]">Breaches found</div></div>
                <div className="rounded-lg border border-[#263a40] bg-[#0b171b] p-4"><div className="text-xl font-bold text-[#ff766f]">{result.riskLabel || "Review"}</div><div className="mt-1 text-xs text-[#91a6aa]">Risk level</div></div>
                <div className="rounded-lg border border-[#263a40] bg-[#0b171b] p-4"><div className="text-xl font-bold text-white">{result.riskScore ?? "—"}</div><div className="mt-1 text-xs text-[#91a6aa]">Risk score</div></div>
              </div>

              {result.exposedData.length > 0 && (
                <div><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white"><Database size={16} className="text-[#54d6c3]" /> Exposed data types</div><div className="flex flex-wrap gap-2">{result.exposedData.map((item) => <span key={item} className="rounded-md border border-[#245a53] bg-[#123933] px-2.5 py-1 text-xs text-[#9ae9dc]">{item.replace(/^.*?data_/, "")}</span>)}</div></div>
              )}

              <div className="space-y-3">
                {result.breaches.slice(0, 10).map((breach, index) => (
                  <article key={`${breach.breach}-${index}`} className="rounded-lg border border-[#263a40] bg-[#0b171b] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3"><div><h4 className="font-bold text-white">{breach.breach || "Unknown breach"}</h4><p className="mt-1 text-xs text-[#91a6aa]">{breach.domain || breach.industry || "Indexed breach"}</p></div><div className="flex items-center gap-1 text-xs text-[#91a6aa]"><CalendarDays size={14} /> {breach.xposed_date || "Date unavailable"}</div></div>
                    {breach.xposed_data && <p className="mt-3 text-sm text-[#91a6aa]">Exposed: {breach.xposed_data}</p>}
                    {breach.xposed_records && <p className="mt-2 text-xs text-[#667f83]">{breach.xposed_records.toLocaleString()} records affected</p>}
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 text-xs text-[#667f83]"><ShieldCheck size={14} /> Your email is sent directly to XposedOrNot for this lookup and is not stored by God&apos;s Eye.</div>

      {showStarPrompt && <GitHubStarPrompt onClose={() => setShowStarPrompt(false)} />}
    </section>
  )
}