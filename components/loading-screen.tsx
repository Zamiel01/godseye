"use client"

import { useState, useEffect } from "react"

export function LoadingScreen() {
  const [statusText, setStatusText] = useState("Connecting to security database")
  const [attempts, setAttempts] = useState(0)

  const statusMessages = [
    "Connecting to security servers",
    "Warming up threat intelligence systems",
    "Initializing breach detection modules",
    "Loading cybersecurity databases",
    "Establishing secure connections",
    "Preparing vulnerability scanners",
    "Loading latest threat feeds",
    "Finalizing security protocols",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setAttempts((prev) => {
        const newAttempts = prev + 1
        const messageIndex = Math.min(newAttempts - 1, statusMessages.length - 1)
        setStatusText(statusMessages[messageIndex])
        return newAttempts
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 text-white"
      style={{
        background: "linear-gradient(135deg, #0f1419 0%, #1a365d 100%)",
      }}
    >
      <div className="flex items-center justify-center gap-4 mb-12 animate-pulse">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 shadow-lg"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            borderColor: "#1a365d",
            boxShadow: "0 0 0 2px white",
          }}
        >
          👁️
        </div>
        <div
          className="text-4xl font-bold"
          style={{
            background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          God's Eye
        </div>
      </div>

      <div
        className="w-15 h-15 border-4 border-t-white rounded-full animate-spin mb-8"
        style={{
          borderColor: "rgba(255, 255, 255, 0.1)",
          borderTopColor: "#ffffff",
        }}
      />

      <div className="text-center max-w-2xl mb-4">
        <div className="text-2xl font-semibold mb-4 text-white">Initializing Security Systems</div>
        <div className="text-base text-gray-300 mb-8 leading-relaxed">
          Starting up security servers and threat intelligence systems. This may take up to 60 seconds for cold start.
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>{statusText}</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }} />
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
        </div>
      </div>
    </div>
  )
}
