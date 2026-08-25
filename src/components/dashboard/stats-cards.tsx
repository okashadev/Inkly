import { UserStats } from "@/types/user";
import { FileText, Eye, Heart, Users, type LucideIcon } from "lucide-react";

interface StatsCardsProps {
  stats: UserStats | null;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statsList = [
    {
      label: "Total Posts",
      value: stats?.totalPosts ?? 0,
      icon: FileText,
    },
    {
      label: "Total Views",
      value: stats?.totalViews ? stats.totalViews.toLocaleString() : 0,
      icon: Eye,
    },
    {
      label: "Total Likes",
      value: stats?.totalLikes ? stats.totalLikes.toLocaleString() : 0,
      icon: Heart,
    },
    {
      label: "Followers",
      value: stats?.totalFollowers ? stats.totalFollowers.toLocaleString() : 0,
      icon: Users,
    },
  ];
  return (
    <section
      aria-label="Key performance stats"
      className="grid grid-cols-2 gap-4 xl:grid-cols-4"
    >
      {statsList.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5 transition-all duration-200 hover:border-outline-variant/20"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </span>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </div>
            </div>
            <h4 className="font-display text-2xl font-bold tracking-tight text-foreground">
              {stat.value}
            </h4>
          </div>
        );
      })}
    </section>
  );
}
