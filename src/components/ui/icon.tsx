"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import * as icons from "@hugeicons/core-free-icons"

export type IconName =
  | "dashboard"
  | "content"
  | "services"
  | "scenarios"
  | "blog"
  | "projects"
  | "partners"
  | "team"
  | "media"
  | "seo"
  | "contact"
  | "social"
  | "settings"
  | "access"
  | "account"
  | "sun"
  | "moon"
  | "language"
  | "menu"
  | "search"
  | "plus"
  | "edit"
  | "delete"
  | "upload"
  | "external"
  | "logout"
  | "chevron"
  | "more"
  | "check"
  | "copy"
  | "image"

const names: Record<IconName, string[]> = {
  dashboard: ["DashboardSquare01Icon", "DashboardSquare02Icon"],
  content: ["WebDesign01Icon", "File01Icon"],
  services: ["Layers01Icon", "PackageIcon"],
  scenarios: ["Route01Icon", "WorkflowCircle01Icon"],
  blog: ["News01Icon", "File02Icon"],
  projects: ["Folder01Icon", "Briefcase01Icon"],
  partners: ["Building03Icon", "Agreement01Icon"],
  team: ["UserGroupIcon", "UserMultiple02Icon"],
  media: ["Image01Icon", "Image02Icon"],
  seo: ["Search02Icon", "Search01Icon"],
  contact: ["Call02Icon", "Mail01Icon"],
  social: ["Share08Icon", "Link01Icon"],
  settings: ["Settings01Icon", "Settings02Icon"],
  access: ["UserShield01Icon", "ShieldUserIcon"],
  account: ["UserCircleIcon", "UserIcon"],
  sun: ["Sun01Icon", "Sun02Icon"],
  moon: ["Moon02Icon", "Moon01Icon"],
  language: ["LanguageCircleIcon", "LanguageSquareIcon"],
  menu: ["Menu01Icon", "Menu02Icon"],
  search: ["Search01Icon", "Search02Icon"],
  plus: ["Add01Icon", "AddCircleIcon"],
  edit: ["Edit02Icon", "PencilEdit01Icon"],
  delete: ["Delete02Icon", "Delete01Icon"],
  upload: ["Upload01Icon", "Upload02Icon"],
  external: ["LinkSquare02Icon", "ArrowUpRight01Icon"],
  logout: ["Logout01Icon", "Logout02Icon"],
  chevron: ["ArrowDown01Icon", "ArrowDown02Icon"],
  more: ["MoreVerticalIcon", "MoreVerticalCircle01Icon"],
  check: ["Tick02Icon", "CheckmarkCircle01Icon"],
  copy: ["Copy01Icon", "Copy02Icon"],
  image: ["Image01Icon", "Image02Icon"],
}

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const collection = icons as unknown as Record<string, Parameters<typeof HugeiconsIcon>[0]["icon"]>
  const icon = names[name].map((candidate) => collection[candidate]).find(Boolean)
  if (!icon) return <span aria-hidden className={className}>•</span>
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={1.8} className={className} aria-hidden />
}
