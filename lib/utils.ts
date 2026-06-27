import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 60) return "text-amber-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Challenging";
  return "Critical Issues";
}

export function getRiskColor(level: string): string {
  switch (level) {
    case "LOW":
      return "text-emerald-600 bg-emerald-600/10";
    case "MEDIUM":
      return "text-amber-600 bg-amber-600/10";
    case "HIGH":
      return "text-red-600 bg-red-600/10";
    default:
      return "text-[#1B1716]/60 bg-[#1B1716]/5";
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-orange-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-amber-500" };
  if (score <= 5) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-emerald-600" };
}

export const INDUSTRIES = [
  "SaaS / Software",
  "FinTech",
  "HealthTech",
  "EdTech",
  "E-commerce",
  "MarketPlace",
  "AI / ML",
  "CleanTech",
  "FoodTech",
  "PropTech",
  "LegalTech",
  "HRTech",
  "AgriTech",
  "MedTech",
  "Gaming",
  "Media & Entertainment",
  "Logistics & Supply Chain",
  "Cybersecurity",
  "Blockchain / Web3",
  "Travel & Hospitality",
  "Fashion & Beauty",
  "Sports & Fitness",
  "Social Media",
  "IoT & Hardware",
  "Other",
];

export const PRICING_MODELS = [
  "Subscription (SaaS)",
  "Freemium",
  "Usage-Based",
  "One-Time Purchase",
  "Marketplace / Commission",
  "Advertising",
  "Enterprise License",
  "Open Source + Support",
  "Transactional",
  "Hybrid Model",
];
