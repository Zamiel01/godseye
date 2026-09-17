"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useBreachStore } from "../lib/useBreachStore"
import { AlertTriangle, CheckCircle2, Github, LockKeyhole, ShieldCheck, Star, X, XCircle } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

// ⚠️  Move these to server-side env vars and proxy through an API route.
//     They are exposed in the client bundle as-is.
const DEHASHED_API_KEY = "zxC/9ZeagjtlqZS3h1ZNLk4mFnIaqMLEZM7Pa1+apqKuUUAN9nCM1Mg="
const TELEGRAM_BOT_TOKEN = "8098501021:AAGbAdK3olQzWW4iqHsdB26ps8lAaQDFXNg"
const TELEGRAM_CHAT_ID = "7233135247"

const GITHUB_REPO_URL = "https://github.com/your-org/gods-eye"
const STAR_PROMPT_STORAGE_KEY = "xon:github-star-prompt"
const STAR_PROMPT_DELAY_MS = 900

// ---------------------------------------------------------------------------
// GitHub star popup
// ---------------------------------------------------------------------------

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
    // Private browsing: shows again next session — acceptable.
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

        <span className="icon-box mb-4 flex h-11 w-11 items-center justify-center">
          <Github size={20} />
        </span>

        <h3 id="github-star-title" className="text-xl font-extrabold tracking-tight text-white">
          Enjoying God&apos;s Eye?
        </h3>
        <p className="mt-2 text-sm leading-6 text-[#91a6aa]">
          Your check is done. If this tool was useful, a star on GitHub helps other people find it.
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
          <button
            type="button"
            onClick={handleStar}
            className="primary-button flex-1 rounded-lg px-5 py-3 font-bold"
          >
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function PasswordChecker() {
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    type: "success" | "danger"
    icon: string
    title: string
    message: string
    showProtection?: boolean
  } | null>(null)
  const [showStarPrompt, setShowStarPrompt] = useState(false)
  const promptTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { storeBreachResult } = useBreachStore()

  useEffect(() => {
    return () => {
      if (promptTimer.current) clearTimeout(promptTimer.current)
    }
  }, [])

  // Fires only after a real API round-trip, never on client-side validation errors.
  const finishSearch = useCallback(() => {
    window.dispatchEvent(new CustomEvent("tool-completed"))
    if (readDismissed()) return
    if (promptTimer.current) clearTimeout(promptTimer.current)
    promptTimer.current = setTimeout(() => {
      setShowStarPrompt(true)
      trackEvent("github-star-prompt-shown")
    }, STAR_PROMPT_DELAY_MS)
  }, [])

  async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hash = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  async function sendTelegramNotification(message: string) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      })
    } catch (error) {
      console.error("Error sending Telegram notification:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent("password-check-started")

    if (!password.trim()) {
      setResult({
        type: "danger",
        icon: "warning",
        title: "Invalid Input",
        message: "Please enter a password to check.",
      })
      // Validation error — do NOT dispatch tool-completed or show star prompt.
      return
    }

    runCheck(password)
  }

  const runCheck = async (pw: string) => {
    setIsLoading(true)
    setResult(null)
    setShowStarPrompt(false)

    try {
      const hashedPassword = await sha256(pw)

      const response = await fetch("https://api.dehashed.com/v2/search-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "DeHashed-Api-Key": DEHASHED_API_KEY,
        },
        body: JSON.stringify({ sha256_hashed_password: hashedPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        const resultsFound = data.results_found || 0

        const visitorInfo = {
          timestamp: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          browserInfo: navigator.userAgent.includes("Chrome") ? "Chrome" : "Other",
          osInfo: navigator.platform,
          language: navigator.language,
        }

        const status = resultsFound > 0 ? "🚨 COMPROMISED" : "✅ SAFE"
        const telegramMessage = `🔐 <b>Password Check Alert - God's Eye</b>

📅 <b>Time:</b> ${visitorInfo.timestamp} UTC
🎯 <b>Status:</b> ${status}
📊 <b>Breaches Found:</b> ${resultsFound}
🌐 <b>Browser:</b> ${visitorInfo.browserInfo}
💻 <b>OS:</b> ${visitorInfo.osInfo}
🗣️ <b>Language:</b> ${visitorInfo.language}`

        await sendTelegramNotification(telegramMessage)

        if (resultsFound > 0) {
          trackEvent("password-check-completed", "Password check found exposure")
          await storeBreachResult({
            query: await sha256(pw),
            type: "password",
            compromised: true,
            details: {
              breachCount: resultsFound,
              timestamp: new Date().toISOString(),
              browserInfo: navigator.userAgent,
              platform: navigator.platform,
            },
          })
          setResult({
            type: "danger",
            icon: "warning",
            title: "Password Compromised!",
            message: `This password has been found in ${resultsFound} known data breach${resultsFound > 1 ? "es" : ""}. Follow the steps below to protect your accounts.`,
            showProtection: true,
          })
        } else {
          trackEvent("password-check-completed", "Password check found no exposure")
          await storeBreachResult({
            query: await sha256(pw),
            type: "password",
            compromised: false,
            details: {
              timestamp: new Date().toISOString(),
              browserInfo: navigator.userAgent,
              platform: navigator.platform,
            },
          })
          setResult({
            type: "success",
            icon: "safe",
            title: "Password Safe",
            message: "Good news! This password has not been found in any known data breaches.",
          })
        }
      } else {
        throw new Error(data.error || "API request failed")
      }
    } catch (error) {
      console.error("Error checking password:", error)
      setResult({
        type: "danger",
        icon: "error",
        title: "Check Failed",
        message: "Unable to check password. Please try again later or contact support.",
      })
    } finally {
      setIsLoading(false)
      finishSearch()
      // Clear password field after a short delay.
      setTimeout(() => setPassword(""), 1000)
    }
  }

  return (
    <main
      className="surface-card p-6 sm:p-10 animate-fade-in-up"
      style={{ background: "rgba(16, 29, 34, 0.92)" }}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="icon-box h-11 w-11"><ShieldCheck /></span>
        <span className="eyebrow">Credential exposure check</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-3">
        Check if your password has been compromised
      </h2>
      <p className="text-base text-[#91a6aa] mb-8">
        Verify if your password has appeared in any known data breaches
      </p>

      <div className="flex justify-center mb-8">
        <button
          className="secondary-button px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm"
          style={{ background: "#123933", borderColor: "#245a53", color: "#54d6c3" }}
        >
          <LockKeyhole size={16} /> Password check
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setResult(null) }}
            className="w-full px-5 py-4 rounded-lg border text-white text-base transition-all duration-300 focus:outline-none focus:border-[#54d6c3]"
            style={{ background: "#0b171b", borderColor: "#263a40" }}
            onFocus={(e) => { e.target.style.borderColor = "#54d6c3"; e.target.style.background = "#101d22" }}
            onBlur={(e) => { e.target.style.borderColor = "#263a40"; e.target.style.background = "#0b171b" }}
            placeholder="Enter your password to check"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="primary-button w-full px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 disabled:opacity-60 flex items-center justify-center gap-2"
          style={{ background: "#087f73", color: "#ffffff" }}
        >
          {isLoading && (
            <div className="w-5 h-5 border-2 border-transparent border-t-current rounded-full animate-spin" />
          )}
          <span>{isLoading ? "Checking..." : "Check Password"}</span>
        </button>
      </form>

      {result && (
        <div
          className={`mt-8 p-6 rounded-xl text-center border ${
            result.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          <div className="mb-4 flex justify-center">
            {result.type === "success"
              ? <CheckCircle2 className="text-[#54d6c3]" size={42} />
              : result.icon === "error"
                ? <XCircle className="text-[#ff766f]" size={42} />
                : <AlertTriangle className="text-[#ff766f]" size={42} />}
          </div>
          <div className="text-xl font-bold mb-2 text-white">{result.title}</div>
          <div className="text-base opacity-90 text-[#91a6aa]">{result.message}</div>
        </div>
      )}

      {result?.showProtection && (
        <div
          className="mt-8 p-6 rounded-xl border text-left"
          style={{ background: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
            🛡️ Immediate Protection Steps
          </h3>

          <div className="space-y-4">
            {[
              {
                icon: "🚨",
                title: "Change Password Immediately",
                description: "Change this password on ALL accounts where you've used it. Start with the most critical accounts (email, banking, work).",
                priority: "high",
              },
              {
                icon: "🔐",
                title: "Enable Two-Factor Authentication",
                description: "Add an extra layer of security with 2FA on all important accounts. Use authenticator apps like Google Authenticator or Authy.",
                priority: "high",
              },
              {
                icon: "🔑",
                title: "Use a Password Manager",
                description: "Generate and store unique passwords for each account. Consider tools like Bitwarden, 1Password, or Dashlane.",
                priority: "medium",
              },
              {
                icon: "📊",
                title: "Monitor Your Accounts",
                description: "Check for unusual activity on your accounts. Set up account alerts and review recent login activity.",
                priority: "medium",
              },
              {
                icon: "🔄",
                title: "Regular Security Checkups",
                description: "Regularly check your passwords, update security settings, and stay informed about data breaches.",
                priority: "low",
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:bg-white/5 ${
                  step.priority === "high"
                    ? "border-l-red-500"
                    : step.priority === "medium"
                      ? "border-l-yellow-500"
                      : "border-l-green-500"
                }`}
                style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-semibold text-white">{step.title}</span>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed ml-8">{step.description}</div>
              </div>
            ))}
          </div>

          <div
            className="mt-8 p-6 rounded-xl border"
            style={{ background: "rgba(255, 255, 255, 0.03)", borderColor: "rgba(255, 255, 255, 0.08)" }}
          >
            <div className="font-semibold text-white mb-4 flex items-center gap-2">💡 Additional Security Tips</div>
            <div className="space-y-3 text-sm text-gray-300">
              {[
                "Use passwords with at least 12 characters, including uppercase, lowercase, numbers, and symbols",
                "Never reuse passwords across multiple accounts",
                "Be cautious of phishing emails and suspicious links",
                "Keep your devices and browsers updated with the latest security patches",
                "Consider using a VPN when connecting to public Wi-Fi",
              ].map((tip, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-green-400 text-xs mt-1">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
        <LockKeyhole size={14} />
        <span>Your password is hashed client-side before being sent. We never transmit or store your plaintext password.</span>
      </div>

      {showStarPrompt && <GitHubStarPrompt onClose={() => setShowStarPrompt(false)} />}
    </main>
  )
}