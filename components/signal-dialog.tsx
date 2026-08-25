"use client"

import { useState, useEffect } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendTelegramNotification } from "@/lib/telegramNotifier"
import { User, Lightbulb } from "lucide-react"

type Step = 1 | 2

export function SignalDialog({ open, source, onComplete }: { open: boolean; source: string; onComplete?: () => void }) {
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState("")
  const [feature, setFeature] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1)
      setName("")
      setFeature("")
      setSubmitting(false)
    }
  }, [open])

  const handleSubmit = async () => {
    setSubmitting(true)
    const message =
      `🚀 New God's Eye Feature Request\n` +
      `Source: ${source}\n` +
      `Name: ${name || "N/A"}\n` +
      `Feature: ${feature}`

    await sendTelegramNotification(message)
    try { localStorage.setItem("godseye_submitted", "true") } catch {}
    setSubmitting(false)
    onComplete?.()
  }

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-lg text-white"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight text-white">
            One quick thing before your scan
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-gray-400 leading-relaxed">
            I'm Eugene, the solo dev behind God's Eye. Tell me one feature you'd love — it takes 10 seconds,
            and this scan will unlock as soon as you hit submit.
          </DialogPrimitive.Description>

          {step === 1 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  Name
                </label>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-blue-500"
                />
              </div>
              <Button onClick={() => setStep(2)} className="w-full bg-blue-600 hover:bg-blue-700">
                Next
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                  What feature would you like to see?
                </label>
                <Input
                  placeholder="e.g. Dark mode, bulk scan, export reports…"
                  value={feature}
                  onChange={(e) => setFeature(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800">
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={submitting || !feature.trim()} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50">
                  {submitting ? "Opening scan…" : "Run scan"}
                </Button>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-600 w-full text-center pt-2">No account needed · No data stored · Just your idea</p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}