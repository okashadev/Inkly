import { Search, Bell } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Overview", active: true },
  { label: "Community", active: false },
  { label: "Support", active: false },
]

export function TopNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-20 items-center justify-between border-b border-border/30 bg-background/70 px-6 backdrop-blur-xl md:left-64 md:px-12">
      <div className="flex items-center gap-4">
        <div className="font-display text-xl font-extrabold tracking-tighter text-primary md:hidden">
          Inkly
        </div>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {tabs.map((tab) => (
            <a
              key={tab.label}
              href="#"
              className={cn(
                "font-display text-sm font-bold tracking-tight transition-colors",
                tab.active
                  ? "border-b-2 border-primary pb-1 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={tab.active ? "page" : undefined}
            >
              {tab.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span
            className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background"
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant/30 bg-surface-container-high transition-transform active:scale-95"
          aria-label="Open profile menu"
        >
          <Image
            src="/images/avatar.jpg"
            alt="Alex's avatar"
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  )
}
