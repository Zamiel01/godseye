export function Header() {
  return (
    <header className="animate-fade-in-down grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
      <div>
        <div className="eyebrow mb-5 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#087f73]" /> Privacy-first security intelligence</div>
        <h1 className="max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-[-0.055em] leading-[0.98] text-white">
          Know what&apos;s exposed. Protect what matters.
        </h1>
        <p className="max-w-2xl mt-6 text-base sm:text-lg leading-8 text-[#91a6aa]">
          Check passwords and personal details against known breach data with a focused, transparent security toolkit.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#security-tools" className="primary-button inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-bold">Start a security check <span aria-hidden="true">↘</span></a>
          <span className="secondary-button inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold"><span className="icon-box h-5 w-5 rounded-full"><svg viewBox="0 0 24 24" fill="none"><path d="M12 3 5 6v5c0 4.2 2.8 8 7 10 4.2-2 7-5.8 7-10V6l-7-3Z" stroke="currentColor"/><path d="m9.5 12 1.7 1.7 3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/></svg></span> Built for privacy</span>
        </div>
      </div>
      <div className="hidden lg:block justify-self-end max-w-sm border-l border-[#b9ddd7] pl-7 pb-2">
        <p className="eyebrow mb-3">The signal, not the noise</p>
        <p className="text-sm leading-7 text-[#91a6aa]">A practical view of your digital exposure, designed to help you make the next safe decision.</p>
      </div>
    </header>
  )
}
