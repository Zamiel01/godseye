type GoatCounterEvent = {
  path: string
  title?: string
}

declare global {
  interface Window {
    goatcounter?: {
      count: (event: GoatCounterEvent) => void
    }
  }
}

export function trackEvent(path: string, title?: string) {
  if (typeof window === "undefined" || !window.goatcounter) return

  window.goatcounter.count({
    path: `/events/${path}`,
    title,
  })
}
