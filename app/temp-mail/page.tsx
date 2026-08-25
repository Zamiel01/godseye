'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { CopyIcon, RefreshCw, InboxIcon, MailIcon, ChevronDownIcon, ChevronUpIcon, SendIcon } from "lucide-react"

const LS_EMAIL_KEY = "godseye_temp_email"
const LS_MSGS_KEY = "godseye_temp_messages"

function randomString(len = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz"
  let out = ""
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function randomDomain() {
  return ["mailtm.com", "inbox.test", "tempmail.dev", "throwaway.me"][Math.floor(Math.random() * 4)]
}

function generateMockEmail() {
  return `${randomString(8)}@${randomDomain()}`
}

const SAMPLE_MESSAGES = [
  { from: "noreply@github.com", subject: "Verify your email address", intro: "Thanks for signing up! Click the link below to verify your email address.", body: "<p>Click <a href='#'>here</a> to verify your email.</p>" },
  { from: "security@google.com", subject: "Security alert: new sign-in", intro: "A new sign-in was detected on your account from Windows.", body: "<p>If this was you, no action is needed.</p>" },
  { from: "promo@shopify.com", subject: "Your store is ready to launch", intro: "Congratulations! Your Shopify trial has started.", body: "<p>Get started with our onboarding guide.</p>" },
  { from: "newsletter@hackernews.com", subject: "Top stories this week", intro: "Here are the top 10 stories from this week.", body: "<ul><li>HN item 1</li><li>HN item 2</li></ul>" },
]

function TempMailLoadingScreen() {
  const [statusText, setStatusText] = useState("Generating disposable address")
  const statusMessages = ["Generating disposable address", "Connecting to mail servers", "Setting up inbox", "Ready"]

  useEffect(() => {
    const t = setInterval(() => {
      setStatusText((prev) => {
        const idx = statusMessages.indexOf(prev)
        return idx < statusMessages.length - 1 ? statusMessages[idx + 1] : prev
      })
    }, 600)
    const timeout = setTimeout(() => clearInterval(t), 2500)
    return () => { clearInterval(t); clearTimeout(timeout) }
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 text-white" style={{ background: "linear-gradient(135deg,#0f1419,#1a365d)" }}>
      <div className="w-12 h-12 border-4 border-t-blue-400 rounded-full animate-spin mb-6" style={{ borderColor: "rgba(66,153,225,0.2)", borderTopColor: "#4299e1" }} />
      <p className="text-blue-300 text-sm">{statusText}…</p>
    </div>
  )
}

interface EmailMessage {
  id: string
  from: { address: string }
  subject: string
  intro: string
  createdAt: string
  text?: string
  body?: string
}

export default function TempMailPage() {
  const [email, setEmail] = useState<string>("")
  const [messages, setMessages] = useState<EmailMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [composeOpen, setComposeOpen] = useState(false)
  const [toAddr, setToAddr] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")

  const loadOrCreateEmail = () => {
    const existing = localStorage.getItem(LS_EMAIL_KEY)
    if (existing) {
      setEmail(existing)
      setMessages(JSON.parse(localStorage.getItem(LS_MSGS_KEY) || "[]"))
    } else {
      const newEmail = generateMockEmail()
      localStorage.setItem(LS_EMAIL_KEY, newEmail)
      localStorage.setItem(LS_MSGS_KEY, JSON.stringify(SAMPLE_MESSAGES.map((m, i) => ({ ...m, id: `msg-${Date.now()}-${i}`, createdAt: new Date(Date.now() - i * 3600000).toISOString() }))))
      setEmail(newEmail)
      setMessages(JSON.parse(localStorage.getItem(LS_MSGS_KEY)!))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadOrCreateEmail()
  }, [])

  const generateNewEmail = () => {
    const newEmail = generateMockEmail()
    localStorage.setItem(LS_EMAIL_KEY, newEmail)
    localStorage.setItem(LS_MSGS_KEY, JSON.stringify([]))
    setEmail(newEmail)
    setMessages([])
    setExpandedId(null)
    toast({ title: "New address generated", description: newEmail })
  }

  const checkMessages = () => {
    const stored = JSON.parse(localStorage.getItem(LS_MSGS_KEY) || "[]")
    if (stored.length === 0 && Math.random() > 0.5) {
      const sample = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)]
      const newMsg: EmailMessage = {
        ...sample,
        id: `msg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        from: { address: sample.from },
      }
      const updated = [newMsg, ...stored]
      localStorage.setItem(LS_MSGS_KEY, JSON.stringify(updated))
      setMessages(updated)
      toast({ title: "New message received", description: sample.subject })
    } else {
      setMessages(stored)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email)
      toast({ title: "Copied!", description: "Email copied to clipboard" })
    } catch {
      toast({ title: "Error", description: "Failed to copy", variant: "destructive" })
    }
  }

  const sendMessage = () => {
    if (!toAddr.trim() || !subject.trim() || !body.trim()) {
      toast({ title: "Invalid", description: "All fields required", variant: "destructive" })
      return
    }
    const sentMsg: EmailMessage = {
      id: `sent-${Date.now()}`,
      from: { address: email },
      subject: `To: ${toAddr} — ${subject}`,
      intro: body.slice(0, 100),
      createdAt: new Date().toISOString(),
      body: `<p>${body.replace(/\n/g, "<br/>")}</p>`,
      text: body,
    }
    const updated = [sentMsg, ...messages]
    localStorage.setItem(LS_MSGS_KEY, JSON.stringify(updated))
    setMessages(updated)
    setComposeOpen(false)
    setToAddr("")
    setSubject("")
    setBody("")
    toast({ title: "Message sent (locally)", description: "Stored in Sent folder" })
  }

  const formatDate = (d: string) => new Date(d).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {loading && <TempMailLoadingScreen />}
      <div className="container mx-auto pt-8 pb-4 px-4">
        <div className="flex flex-col items-center justify-center mb-8 animate-fade-in-down">
          <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-lg relative overflow-hidden animate-pulse-custom mb-4" style={{ background: "linear-gradient(45deg,#1a365d,#2d3748)", borderColor: "#4299e1", boxShadow: "0 0 20px rgba(66,153,225,0.3)" }}>
            <MailIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-2 gradient-text">Temporary Email Service</h1>
          <p className="text-blue-300 text-center max-w-2xl text-sm">Disposable address — messages stored locally in your browser.</p>
        </div>

        <div className="container mx-auto px-4 pb-16 space-y-6 animate-fade-in-up">
          <Card className="glass border-0 overflow-hidden shadow-xl rounded-xl">
            <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <MailIcon className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-medium text-white">Your Temporary Email</h2>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={generateNewEmail} variant="secondary" size="sm" disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />New Address</Button>
                  <Button onClick={() => setComposeOpen(!composeOpen)} size="sm" className="bg-blue-700 hover:bg-blue-600"><SendIcon className="mr-2 h-4 w-4" />Compose</Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">Email Address:</p>
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg font-mono flex-1 break-all">{email || "Generating…"}</span>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-blue-400 hover:text-blue-300"><CopyIcon className="h-4 w-4" /></Button>
                </div>
              </div>

              {composeOpen && (
                <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  <input className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-400 outline-none" placeholder="To (email address)" value={toAddr} onChange={(e) => setToAddr(e.target.value)} />
                  <input className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-400 outline-none" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                  <textarea className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-gray-400 outline-none h-32 resize-none" placeholder="Write your message…" value={body} onChange={(e) => setBody(e.target.value)} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setComposeOpen(false)} className="border-gray-600 text-gray-300">Cancel</Button>
                    <Button onClick={sendMessage} className="bg-green-600 hover:bg-green-700">Send</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="glass border-0 overflow-hidden shadow-xl rounded-xl">
            <div className="bg-gradient-to-r from-blue-900/50 to-slate-900/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <InboxIcon className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-medium text-white">Inbox</h2>
                  {messages.length > 0 && <span className="text-xs text-blue-300 bg-blue-900/40 px-2 py-0.5 rounded-full">{messages.length}</span>}
                </div>
                <Button onClick={checkMessages} variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300" disabled={refreshing}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />Refresh
                </Button>
              </div>
            </div>

            <div className="p-6">
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto bg-slate-800/80 rounded-full flex items-center justify-center mb-4 border border-slate-700/50"><InboxIcon className="h-8 w-8 text-slate-500" /></div>
                  <h3 className="text-slate-300 text-lg font-medium mb-2">Your inbox is empty</h3>
                  <p className="text-slate-400 max-w-md mx-auto text-sm">Messages appear here when they arrive. Click Refresh to check.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className="bg-slate-800/80 rounded-lg border border-slate-700/50 overflow-hidden cursor-pointer hover:bg-slate-800 transition-all">
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm sm:text-base truncate">{msg.subject}</h3>
                            <p className="text-blue-400 text-xs sm:text-sm truncate">From: {msg.from.address}</p>
                          </div>
                          <span className="text-slate-400 text-xs whitespace-nowrap ml-3">{formatDate(msg.createdAt)}</span>
                        </div>
                        <p className="text-slate-300 text-sm line-clamp-2 mt-1">{msg.intro}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">{expandedId === msg.id ? "Click to collapse" : "Click to read"}</span>
                          {expandedId === msg.id ? <ChevronUpIcon className="h-4 w-4 text-blue-400" /> : <ChevronDownIcon className="h-4 w-4 text-blue-400" />}
                        </div>
                      </div>
                      {expandedId === msg.id && (
                        <div className="px-4 pb-4 pt-2 border-t border-slate-700/50 animate-fade-in">
                          <div className="bg-slate-900/50 p-4 rounded-lg text-slate-200 text-sm prose prose-invert max-w-none overflow-auto">
                            <div dangerouslySetInnerHTML={{ __html: msg.body || msg.text || "" }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <p className="text-center text-slate-500 text-xs mt-8">Local mock · messages stored in browser only · no external service</p>
        </div>
      </div>
    </div>
  )
}