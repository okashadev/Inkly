import {
  NotebookPen,
  LayoutGrid,
  UserRound,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

type Action = {
  label: string;
  description: string;
  icon: LucideIcon;
  link: string;
};

const actions: Action[] = [
  {
    label: "Write New Post",
    description: "Create and publish a new article",
    icon: NotebookPen,
    link: "/user/post/add",
  },
  {
    label: "View All Blogs",
    description: "Manage your published and draft posts",
    icon: LayoutGrid,
    link: "/user/my_blogs",
  },
  {
    label: "Go to Profile",
    description: "Update your public profile and bio",
    icon: UserRound,
    link: "/user/profile",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-6">
      <h4 className="mb-4 font-display text-base font-bold text-foreground">
        Quick Actions
      </h4>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              href={action.link}
              key={action.label}
              className="group flex w-full items-center justify-between rounded-xl border border-outline-variant/10 bg-surface/50 p-3.5 transition-all hover:border-primary/20 hover:bg-primary/5"
            >
              <div className="flex items-center gap-3.5">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-sm font-semibold text-foreground">
                    {action.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </div>
              </div>
              <ChevronRight
                className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
