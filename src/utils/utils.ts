import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as LucideIcons from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const iconMap: Record<string, keyof typeof LucideIcons> = {
  // Basic icons
  check: "Check",
  x: "X",
  plus: "Plus",
  minus: "Minus",

  // Arrow icons
  "arrow-up": "ArrowUp",
  "arrow-down": "ArrowDown",
  "arrow-left": "ArrowLeft",
  "arrow-right": "ArrowRight",

  // UI icons
  search: "Search",
  menu: "Menu",
  settings: "Settings",

  // Status icons
  info: "Info",
  warning: "AlertTriangle",
  error: "AlertCircle",
  success: "CheckCircle",

  // File icons
  file: "File",
  download: "Download",
  upload: "Upload",

  // User icons
  user: "User",
  users: "Users",
  "user-plus": "UserPlus",

  // Action icons
  edit: "Edit",
  trash: "Trash2",
  filter: "Filter",
  compare: "BarChart3",
  star: "Star",

  // Status icons (additional)
  "check-circle": "CheckCircle",
  "x-circle": "XCircle",
  clock: "Clock",
  "skip-forward": "SkipForward",
  ban: "Ban",
  circle: "Circle",

  // Chevron icons
  "chevron-up": "ChevronUp",
  "chevron-down": "ChevronDown",
  "chevron-left": "ChevronLeft",
  "chevron-right": "ChevronRight",
  "chevron-up-down": "ChevronsUpDown",

  // Additional icons
  table: "Table",
  eye: "Eye",
  "eye-off": "EyeOff",
  shield: "Shield",
  lock: "Lock",
  refresh: "RefreshCw",
  save: "Save",

  // Navigation and UI icons
  home: "Home",
  document: "FileText",
  bell: "Bell",
  close: "X",
  logout: "LogOut",
};
