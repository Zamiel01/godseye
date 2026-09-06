"use client"

import { useEffect, useState } from "react"
import { ThumbsDown, ThumbsUp, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { sendTelegramNotification } from "@/lib/telegramNotifier"
import { trackEvent } from "@/lib/analytics"

const STORAGE_KEY = "godseye-support-feedback"

export function SupportPopup() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return
    } catch {
      return
    }

    const timer = window.setTimeout(() => {
      setVisible(true)
      trackEvent("support-popup-shown")
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [])

  const close = (eventName: string) => {
    try { localStorage.setItem(STORAGE_KEY, eventName) } catch {}
    trackEvent(eventName)
    setVisible(false)
  }

  const respond = async (response: "SUPPORT" | "NOT_NOW") => {
    close(response === "SUPPORT" ? "support-popup-positive" : "support-popup-negative")
    await sendTelegramNotification(
      `God's Eye Support Feedback\n\nResponse: ${response}\nTime: ${new Date().toISOString()}\nPage: ${pathname}`,
    )
  }

  if (!visible) return null

  return (
    <aside
      role="dialog"
      aria-label="Support God's Eye"
      className="fixed bottom-5 right-5 z-40 w-[calc(100%-2.5rem)] max-w-sm rounded-2xl border border-[#263a40] bg-[#101d22] p-5 text-white shadow-2xl shadow-black/40"
    >
      <button
        type="button"
        onClick={() => close("support-popup-dismissed")}
        aria-label="Close support question"
        className="absolute right-3 top-3 rounded-md p-1 text-[#91a6aa] transition hover:bg-white/10 hover:text-white"
      >
        <X size={16} />
      </button>

      <p className="eyebrow mb-2">A quick question</p>
      <h2 className="pr-6 text-base font-bold">Would you support the God's Eye project?</h2>
      <p className="mt-2 text-sm leading-6 text-[#91a6aa]">Your feedback helps me understand whether this tool is useful.</p>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => respond("SUPPORT")}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#54d6c3] px-3 py-2.5 text-sm font-bold text-[#071b1c] transition hover:bg-[#76e5d4]"
        >
          <ThumbsUp size={16} /> I&apos;d support it
        </button>
        <button
          type="button"
          onClick={() => respond("NOT_NOW")}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#263a40] px-3 py-2.5 text-sm font-semibold text-[#91a6aa] transition hover:border-[#54d6c3] hover:text-white"
        >
          <ThumbsDown size={16} /> Not right now
        </button>
      </div>
    </aside>
  )
}
