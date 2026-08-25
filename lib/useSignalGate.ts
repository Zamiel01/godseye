import { useState, useCallback } from "react"

export function useSignalGate() {
  const [gateOpen, setGateOpen] = useState(false)
  const [pendingRun, setPendingRun] = useState<(() => void) | null>(null)

  const requestAccess = useCallback((run: () => void) => {
    setPendingRun(() => run)
    setGateOpen(true)
  }, [])

  const takePending = useCallback((): (() => void) | null => {
    const fn = pendingRun
    setPendingRun(null)
    return fn
  }, [pendingRun])

  return { gateOpen, setGateOpen, requestAccess, takePending }
}