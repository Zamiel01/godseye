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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in-up">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="text-center p-6 sm:p-8 rounded-2xl border transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            borderColor: "rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          }}
        >
          <span className="text-4xl mb-4 block">{stat.icon}</span>
          <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
          <div className="text-sm sm:text-base text-gray-300">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
