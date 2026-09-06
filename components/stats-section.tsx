export function StatsSection() {
  const stats = [
    {
      icon: "database",
      number: "1,250+",
      label: "Total Breaches Monitored",
    },
    {
      icon: "activity",
      number: "15.2B+",
      label: "Compromised Accounts",
    },
    {
      icon: "shield",
      number: "98",
      label: "Data Types Tracked",
    },
  ]

  return (
    <section className="animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-3 surface-card divide-y sm:divide-y-0 sm:divide-x divide-[#dbe5e2]">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-5 sm:p-6"
          >
            <span className="icon-box h-11 w-11 shrink-0"><svg viewBox="0 0 24 24" fill="none">{stat.icon === "database" ? <><ellipse cx="12" cy="5" rx="7" ry="3" stroke="currentColor"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" stroke="currentColor"/></> : stat.icon === "activity" ? <><path d="M3 12h4l2-7 4 14 2-7h6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></> : <><path d="M12 3 5 6v5c0 4.2 2.8 8 7 10 4.2-2 7-5.8 7-10V6l-7-3Z" stroke="currentColor"/><path d="m9.5 12 1.7 1.7 3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></>}</svg></span>
            <div><div className="text-2xl font-extrabold tracking-tight text-white">{stat.number}</div><div className="text-xs leading-5 text-[#91a6aa]">{stat.label}</div></div>
          </div>
        ))}
      </div>
    </section>
  )
}
