import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLongDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso))
}

export function formatDeadlineFr(iso: string): string {
  const date = new Date(iso)
  const day = date.getDate()
  const month = new Intl.DateTimeFormat("fr-FR", { month: "long" }).format(date)
  return `${day === 1 ? "1er" : day} ${month} ${date.getFullYear()}`
}
