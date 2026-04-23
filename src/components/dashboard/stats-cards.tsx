import { FileText, Eye, Heart, Users, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Stat = {
  label: string
  value: string
  delta: string
  deltaTone: "positive" | "accent"
  icon: LucideIcon
}

const stats: Stat[] = [
  { label: "Total Posts", value: "42", delta: "+12%", deltaTone: "positive", icon: FileText },
  { label: "Total Views", value: "12.5k", delta: "+24%", deltaTone: "positive", icon: Eye },
  { label: "Total Likes", value: "3.2k", delta: "+8%", deltaTone: "accent", icon: Heart },
  { label: "Followers", value: "480", delta: "+18%", deltaTone: "positive", icon: Users },
]

export function StatsCards() {
  return (
    <section
      aria-label="Key performance stats"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-outline-variant/10 bg-surface-container/80 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-1 text-xs font-medium",
                  stat.deltaTone === "positive"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-pink-400/10 text-pink-400",
                )}
              >
                {stat.delta}
              </span>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <h4 className="mt-1 font-display text-3xl font-bold text-foreground">
              {stat.value}
            </h4>
          </div>
        )
      })}
    </section>
  )
}
