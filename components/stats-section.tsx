export function StatsSection() {
  const stats = [
    {
      icon: "🗄️",
      number: "1,250+",
      label: "Total Breaches Monitored",
    },
    {
      icon: "⚠️",
      number: "15.2B+",
      label: "Compromised Accounts",
    },
    {
      icon: "🛡️",
      number: "98",
      label: "Data Types Tracked",
    },
  ]

  return (
    <section className="animate-fade-in-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center p-4 sm:p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderColor: "rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            <span className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 block">{stat.icon}</span>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">{stat.number}</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-300 leading-tight">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
