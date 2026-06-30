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
  icon: LucideIcon;
  link: string;
};

const actions: Action[] = [
  {
    label: "Write New Post",
    icon: NotebookPen,
    link: "/user/post/add",
  },
  {
    label: "View All Blogs",
    icon: LayoutGrid,
    link: "/user/my_blogs",
  },
  {
    label: "Go to Profile",
    icon: UserRound,
    link: "/user/profile",
  },
];

export function QuickActions() {
  return (
    <div className="rounded-2xl border border-outline-variant/10 bg-surface-container-low p-8">
      <h4 className="mb-6 font-display text-lg font-bold text-foreground">
        Quick Actions
      </h4>
      <div className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              href={action.link}
              key={action.label}
              type="button"
              className="group flex w-full items-center justify-between rounded-full border border-outline-variant/5 bg-surface p-4 transition-all hover:bg-primary/5"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-medium text-foreground">
                  {action.label}
                </span>
              </div>
              <ChevronRight
                className="h-5 w-5 text-muted-foreground/60 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
