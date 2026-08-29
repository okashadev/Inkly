"use client";
import Link from "next/link";
import { IconType } from "react-icons";
import { HiChevronRight } from "react-icons/hi2";

interface SettingsItemProps {
  title: string;
  description: string;
  icon: IconType;
  href: string;
  badge?: string;
  isDanger?: boolean;
}

export function SettingsItem({
  title,
  description,
  icon: Icon,
  href,
  badge,
  isDanger = false,
}: SettingsItemProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
        isDanger
          ? "bg-red-500/5 hover:bg-red-500/10 border-red-500/20 hover:border-red-500/40"
          : "bg-[#1C2745] hover:bg-[#223055] border-white/5 hover:border-white/15"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2.5 rounded-lg border ${
            isDanger
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-[#131C35] border-white/10 text-blue-400 group-hover:text-blue-300"
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4
              className={`text-sm font-semibold ${
                isDanger ? "text-red-400" : "text-white"
              }`}
            >
              {title}
            </h4>
            {badge && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold border border-blue-500/30">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <HiChevronRight
        className={`w-5 h-5 transition-transform duration-200 group-hover:translate-x-1 ${
          isDanger
            ? "text-red-400/70 group-hover:text-red-400"
            : "text-slate-400 group-hover:text-white"
        }`}
      />
    </Link>
  );
}
