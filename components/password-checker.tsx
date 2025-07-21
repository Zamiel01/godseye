"use client"

import type React from "react"
import { useState } from "react"
import { useBreachStore } from "../lib/useBreachStore"

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
  
  const { storeBreachResult } = useBreachStore()

  // SHA-256 hashing function
  async function sha256(text: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hash = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hash))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return hashHex
  }

  // Telegram notification function
  async function sendTelegramNotification(message: string) {
    try {
      const BOT_TOKEN = "8098501021:AAGbAdK3olQzWW4iqHsdB26ps8lAaQDFXNg"
      const CHAT_ID = "7233135247"

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
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

    if (!password.trim()) {
      setResult({
        type: "danger",
        icon: "⚠️",
        title: "Invalid Input",
        message: "Please enter a password to check.",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      // Hash the password client-side
      const hashedPassword = await sha256(password)

      // Make API request
      const response = await fetch("https://api.dehashed.com/v2/search-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "DeHashed-Api-Key": "zxC/9ZeagjtlqZS3h1ZNLk4mFnIaqMLEZM7Pa1+apqKuUUAN9nCM1Mg=",
        },
        body: JSON.stringify({
          sha256_hashed_password: hashedPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const resultsFound = data.results_found || 0

        // Send notification about password check
        const visitorInfo = {
          timestamp: new Date().toLocaleString("en-US", { timeZone: "UTC" }),
          browserInfo: navigator.userAgent.includes("Chrome") ? "Chrome" : "Other",
          osInfo: navigator.platform,
          language: navigator.language,
        }

        const status = resultsFound > 0 ? "🚨 COMPROMISED" : "✅ SAFE"
        const message = `🔐 <b>Password Check Alert - Gods Eye</b>

📅 <b>Time:</b> ${visitorInfo.timestamp} UTC
🎯 <b>Status:</b> ${status}
📊 <b>Breaches Found:</b> ${resultsFound}
🌐 <b>Browser:</b> ${visitorInfo.browserInfo}
💻 <b>OS:</b> ${visitorInfo.osInfo}
🗣️ <b>Language:</b> ${visitorInfo.language}`

        await sendTelegramNotification(message)

        if (resultsFound > 0) {
          // Store compromised password result in Firebase
          await storeBreachResult({
            query: await sha256(password), // Store hashed password for security
            type: 'password',
            compromised: true,
            details: {
              breachCount: resultsFound,
              timestamp: new Date().toISOString(),
              browserInfo: navigator.userAgent,
              platform: navigator.platform
            }
          });

          setResult({
            type: "danger",
            icon: "🚨",
            title: "Password Compromised!",
            message: `This password has been found in ${resultsFound} known data breach${resultsFound > 1 ? "es" : ""}. Follow the steps below to protect your accounts.`,
            showProtection: true,
          })
        } else {
          // Store safe password result in Firebase
          await storeBreachResult({
            query: await sha256(password), // Store hashed password for security
            type: 'password',
            compromised: false,
            details: {
              timestamp: new Date().toISOString(),
              browserInfo: navigator.userAgent,
              platform: navigator.platform
            }
          });

          setResult({
            type: "success",
            icon: "✅",
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
        icon: "❌",
        title: "Check Failed",
        message: "Unable to check password. Please try again later or contact support.",
      })
    } finally {
      setIsLoading(false)
      // Clear password after a delay
      setTimeout(() => {
        setPassword("")
      }, 1000)
    }
  }

  return (
    <main
      className="rounded-3xl p-6 sm:p-12 mb-12 animate-fade-in-up border"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="text-center mb-8">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto mb-8 opacity-30"
        >
          <path
            d="M40 5L10 18V37C10 53 21 67 40 75C59 67 70 53 70 37V18L40 5Z"
            fill="white"
            stroke="#1a365d"
            strokeWidth="2"
          />
          <ellipse cx="40" cy="40" rx="20" ry="12" fill="#1a365d" />
          <circle cx="40" cy="40" r="8" fill="white" />
          <circle cx="40" cy="40" r="4" fill="#1a365d" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
        Check if your password has been compromised
      </h2>
      <p className="text-lg text-gray-300 text-center mb-8">
        Verify if your password has appeared in any known data breaches
      </p>

      <div className="flex justify-center mb-8">
        <button
          className="px-6 py-3 rounded-full font-medium flex items-center gap-2 border-2"
          style={{
            background: "#ffffff",
            borderColor: "#ffffff",
            color: "#1a365d",
          }}
        >
          🔒 Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-6">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setResult(null)
            }}
            className="w-full px-6 py-4 rounded-xl border-2 text-white text-base transition-all duration-300 focus:outline-none"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#ffffff"
              e.target.style.background = "rgba(255, 255, 255, 0.08)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"
              e.target.style.background = "rgba(255, 255, 255, 0.05)"
            }}
            placeholder="Enter your password to check"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            color: "#1a365d",
          }}
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
          <div className="text-5xl mb-4">{result.icon}</div>
          <div className="text-xl font-semibold mb-2">{result.title}</div>
          <div className="text-base opacity-90">{result.message}</div>
        </div>
      )}

      {result?.showProtection && (
        <div
          className="mt-8 p-6 rounded-xl border text-left"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            borderColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
            🛡️ Immediate Protection Steps
          </h3>

          <div className="space-y-4">
            {[
              {
                icon: "🚨",
                title: "Change Password Immediately",
                description:
                  "Change this password on ALL accounts where you've used it. Start with the most critical accounts (email, banking, work).",
                priority: "high",
              },
              {
                icon: "🔐",
                title: "Enable Two-Factor Authentication",
                description:
                  "Add an extra layer of security with 2FA on all important accounts. Use authenticator apps like Google Authenticator or Authy.",
                priority: "high",
              },
              {
                icon: "🔑",
                title: "Use a Password Manager",
                description:
                  "Generate and store unique passwords for each account. Consider tools like Bitwarden, 1Password, or Dashlane.",
                priority: "medium",
              },
              {
                icon: "📊",
                title: "Monitor Your Accounts",
                description:
                  "Check for unusual activity on your accounts. Set up account alerts and review recent login activity.",
                priority: "medium",
              },
              {
                icon: "🔄",
                title: "Regular Security Checkups",
                description:
                  "Regularly check your passwords, update security settings, and stay informed about data breaches.",
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
                style={{
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
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
            style={{
              background: "rgba(255, 255, 255, 0.03)",
              borderColor: "rgba(255, 255, 255, 0.08)",
            }}
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
        <span>🔐</span>
        <span>Your data is hashed client-side for privacy. We never store your actual input.</span>
      </div>
    </main>
  )
}
