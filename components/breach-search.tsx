"use client"

import type React from "react"
import { useState } from "react"
import { useBreachStore } from "../lib/useBreachStore"
import { useSignalGate } from "@/lib/useSignalGate"
import { SignalDialog } from "@/components/signal-dialog"

type BreachType = "email" | "username" | "phone" | "ip" | "fullname"

export function BreachSearch() {
  const [currentType, setCurrentType] = useState<BreachType>("email")
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { gateOpen, setGateOpen, requestAccess, takePending } = useSignalGate()

  interface BreachData {
    breach_date: string
    domain: string
    id: string
    index_date: string
    leaked_info: string[]
    logo: string
    record_count: number
    region: string
    source_url: string
    title: string
  }

  interface ApiResponse {
    code: number
    data: {
      data: BreachData[]
      file_name: string
      total_count: number
    }
    msg: string
  }

  const [result, setResult] = useState<{
    type: "success" | "danger"
    icon: string
    title: string
    message: string
    data?: {
      breaches: BreachData[]
      fileName: string
      totalCount: number
    }
  } | null>(null)
const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const tabs = [
    { id: "email" as BreachType, icon: "📧", label: "Email", placeholder: "Enter your email address to search..." },
    { id: "username" as BreachType, icon: "👤", label: "Username", placeholder: "Enter your username to search..." },
    { id: "phone" as BreachType, icon: "📱", label: "Phone", placeholder: "Enter your phone number to search..." },
    { id: "ip" as BreachType, icon: "🌐", label: "IP Address", placeholder: "Enter your IP address to search..." },
    { id: "fullname" as BreachType, icon: "👥", label: "Full Name", placeholder: "Enter your full name to search..." },
  ]

  const currentTab = tabs.find((tab) => tab.id === currentType)!

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) {
      setResult({
        type: "danger",
        icon: "⚠️",
        title: "Invalid Input",
        message: `Please enter a ${currentType} to search.`,
      })
      return
    }

    requestAccess(() => runSearch(currentType, query))
  }

  const runSearch = async (type: BreachType, q: string) => {
    setIsLoading(true)
    setResult(null)
    const { storeBreachResult } = useBreachStore()

    try {
      const apiResponse = await fetch("https://gods-eye-api.onrender.com/api/breach/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q.trim(), type }),
      })

      const data = await apiResponse.json() as ApiResponse

      if (!apiResponse.ok) {
        setResult({
          type: "danger",
          icon: "❌",
          title: "Search Failed",
          message: `${data.msg || "Error"}: ${data.data || ""}`,
        })
        return
      }

      setCurrentPage(1)

      if (data.code === 0 && data.data?.data?.length > 0) {
        await storeBreachResult({
          query: q.trim(),
          type,
          compromised: true,
          details: {
            fileName: data.data.file_name,
            totalCount: data.data.total_count,
            breachCount: data.data.data.length,
          },
        })

        setResult({
          type: "danger",
          icon: "🚨",
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Found in Breaches!`,
          message: `Your ${type} has been found in data breaches. Results saved in ${data.data.file_name}.`,
          data: {
            breaches: data.data.data,
            fileName: data.data.file_name,
            totalCount: data.data.total_count,
          },
        })
      } else {
        await storeBreachResult({
          query: q.trim(),
          type,
          compromised: false,
        })

        setResult({
          type: "success",
          icon: "✅",
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Safe`,
          message: `Great news! No breaches found for your ${type}. Your credentials appear to be safe.`,
        })
      }
    } catch (error: any) {
      setResult({
        type: "danger",
        icon: "❌",
        title: "Search Failed",
        message: `Error: ${error.message}`,
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => setQuery(""), 1000)
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
          <circle cx="35" cy="35" r="12" fill="none" stroke="#1a365d" strokeWidth="3" />
          <path d="m45 45 8 8" stroke="#1a365d" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">Data Breach Search</h2>
      <p className="text-lg text-gray-300 text-center mb-8">
        Search for your personal information in known data breaches
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentType(tab.id)
              setResult(null)
              setQuery("")
            }}
            className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 border-2 transition-all duration-300 ${
              currentType === tab.id
                ? "text-blue-900 border-white"
                : "text-gray-300 border-white/20 hover:border-white/40 hover:text-white"
            }`}
            style={
              currentType === tab.id
                ? {
                    background: "#ffffff",
                    borderColor: "#ffffff",
                  }
                : {}
            }
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
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
            placeholder={currentTab.placeholder}
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
          <span>{isLoading ? "Searching..." : `Check ${currentTab.label}`}</span>
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

      {result?.data && result.type === "danger" && (
        <div className="mt-6 p-6 rounded-xl border" style={{
          background: "rgba(234, 67, 53, 0.1)",
          borderColor: "rgba(234, 67, 53, 0.3)",
        }}>
          <h3 className="text-red-400 text-xl font-semibold mb-4 flex items-center justify-center gap-2">
            ⚠️ Security Alert
          </h3>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {Array.isArray(result.data) ? result.data.length : 1}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Breach{Array.isArray(result.data) && result.data.length > 1 ? "es" : ""} Found
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <div className="text-2xl font-bold text-red-400 mb-1">HIGH</div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">Risk Level</div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
            <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {result.data?.totalCount || 0}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Total Records Found
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <div className="text-2xl font-bold text-red-400 mb-1">
                {result.data?.breaches.length || 0}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Breaches Found
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              <div className="text-sm font-mono text-red-400 mb-1 truncate">
                {result.data?.fileName || "N/A"}
              </div>
              <div className="text-xs text-gray-300 uppercase tracking-wide">
                Result File
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-red-500/30">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Title</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Breach Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Records</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Leaked Info</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-300">Region</th>
                </tr>
              </thead>
              <tbody>
                {result.data?.breaches
                  .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                  .map((breach, index) => (
                    <tr key={breach.id || index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-3 px-4 text-sm text-white">
                        {breach.title || "Unknown"}
                        {breach.domain && (
                          <div className="text-xs text-gray-400">{breach.domain}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-white">
                        {breach.breach_date || "Unknown"}
                        <div className="text-xs text-gray-400">Indexed: {breach.index_date}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-white">
                        {breach.record_count.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-white">
                        <div className="flex flex-wrap gap-1">
                          {breach.leaked_info.map((info, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-full text-xs bg-red-500/20 border border-red-500/30"
                            >
                              {info}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-white">
                        {breach.region || "Unknown"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {(result.data!).breaches.length > itemsPerPage && (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-white">
                Page {currentPage} of {Math.ceil((result.data!).breaches.length / itemsPerPage)}
              </span>
              <button
onClick={() => setCurrentPage(prev => Math.min(Math.ceil((result.data!).breaches.length / itemsPerPage), prev + 1))}
                disabled={currentPage >= Math.ceil((result.data!).breaches.length / itemsPerPage)}
                className="px-3 py-1 rounded-md bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          <p className="text-white text-sm leading-relaxed mt-6">
            Your {currentType} has been found in known data breaches. We recommend taking immediate action to secure
            your accounts.
          </p>
        </div>
      )}

<div className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-2">
        <span>🔐</span>
        <span>Your searches are processed securely. We never store your personal information.</span>
      </div>
      <SignalDialog open={gateOpen} source="breach-search" onComplete={() => { const run = takePending(); setGateOpen(false); run?.() }} />
    </main>
  )
}
