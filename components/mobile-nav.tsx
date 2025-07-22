import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"

interface NavLink {
  href: string
  label: string
  icon: React.ReactNode
}

const navLinks: NavLink[] = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 22V12H15V22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/find-my-phone",
    label: "Find My Phone",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 21C16 21 19 18 19 14C19 10 12 3 12 3C12 3 5 10 5 14C5 18 8 21 12 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="md:hidden shrink-0 h-11 w-11 border-2 rounded-lg transition-all duration-300 hover:bg-white/10"
          style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 sm:w-96 bg-gray-900/95 backdrop-blur-xl border-r border-white/10">
        <div className="flex flex-col h-full">
          <div className="px-4 py-6 border-b border-white/10">
            <div className="flex items-center gap-3 text-white">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2"
                style={{
                  background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
                  color: "#1a365d",
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M15 2L4 7V14C4 20 8 25 15 28C22 25 26 20 26 14V7L15 2Z"
                    fill="#1a365d"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <ellipse cx="15" cy="15" rx="8" ry="5" fill="currentColor" />
                  <circle cx="15" cy="15" r="3" fill="#1a365d" />
                  <circle cx="15" cy="15" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <span className="font-bold text-xl">God's Eye</span>
            </div>
          </div>
          <nav className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-white text-blue-900"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-gray-400 text-center">
              © {new Date().getFullYear()} God's Eye. All rights reserved.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
