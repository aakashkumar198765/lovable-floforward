/**
 * Centralized Tailwind CSS class mappings for consistent styling across components
 */

// Common Size Classes
export const sizeClasses = {
  // Text and icon sizes
  text: {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
  },

  fontWeight: {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  },

  // Button sizes
  button: {
    xs: "px-2 py-1 text-xs min-h-[24px]",
    sm: "px-3 py-1.5 text-sm min-h-[32px]",
    md: "px-4 py-2 text-base min-h-[40px]",
    lg: "px-6 py-3 text-lg min-h-[48px]",
    xl: "px-8 py-4 text-xl min-h-[56px]",
  },

  // Input field sizes
  input: {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg",
  },

  // Avatar sizes
  avatar: {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
    "3xl": "h-24 w-24 text-3xl",
  },

  // Icon sizes
  icon: {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  },

  // Badge sizes
  badge: {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-1 text-sm",
    md: "px-2.5 py-1.5 text-sm",
    lg: "px-3 py-2 text-base",
  },

  // Spacing sizes
  spacing: {
    sm: "p-3 gap-3",
    md: "p-4 gap-4",
    lg: "p-6 gap-6",
  },
};

// Color Variant Classes
export const variantClasses = {
  // Button variants
  button: {
    primary:
      "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 hover:border-primary-700 focus:ring-primary-500",
    secondary:
      "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500",
    tertiary:
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500",
    outline:
      "bg-transparent text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:ring-primary-500",
    "outline-danger":
      "bg-transparent text-error-600 dark:text-error-400 border-error-600 dark:border-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 hover:text-error-700 dark:hover:text-error-300 focus:ring-error-500",
    "outline-success":
      "bg-transparent text-success-600 dark:text-success-400 border-success-600 dark:border-success-400 hover:bg-success-50 dark:hover:bg-success-900/20 hover:text-success-700 dark:hover:text-success-300 focus:ring-success-500",
    "outline-warning":
      "bg-transparent text-warning-600 dark:text-warning-400 border-warning-600 dark:border-warning-400 hover:bg-warning-50 dark:hover:bg-warning-900/20 hover:text-warning-700 dark:hover:text-warning-300 focus:ring-warning-500",
    danger:
      "bg-error-600 text-white border-error-600 hover:bg-error-700 hover:border-error-700 focus:ring-error-500",
    success:
      "bg-success-600 text-white border-success-600 hover:bg-success-700 hover:border-success-700 focus:ring-success-500",
    warning:
      "bg-warning-600 text-white border-warning-600 hover:bg-warning-700 hover:border-warning-700 focus:ring-warning-500",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-200 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 focus:ring-gray-500",
    link: "bg-transparent text-primary-600 dark:text-primary-400 border-transparent hover:text-primary-700 dark:hover:text-primary-300 hover:underline focus:ring-primary-500 p-0 min-h-auto",
  },

  // Input variants
  input: {
    default:
      "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
    outlined:
      "border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent",
    filled: "border-0 bg-gray-100 dark:bg-gray-700",
  },

  // Badge variants
  badge: {
    primary:
      "bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    success:
      "bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-300",
    warning:
      "bg-warning-100 text-warning-800 dark:bg-warning-900/20 dark:text-warning-300",
    error:
      "bg-error-100 text-error-800 dark:bg-error-900/20 dark:text-error-300",
  },

  // Alert variants
  alert: {
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300",
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300",
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300",
  },

  alertVariantColors: {
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-700",
      text: "text-blue-900 dark:text-blue-200",
      icon: "text-blue-500 dark:text-blue-400",
    },
    success: {
      bg: "bg-success-50 dark:bg-success-900/20",
      border: "border-success-200 dark:border-success-700",
      text: "text-success-900 dark:text-success-200",
      icon: "text-success-500 dark:text-success-400",
    },
    warning: {
      bg: "bg-warning-50 dark:bg-warning-900/20",
      border: "border-warning-200 dark:border-warning-700",
      text: "text-warning-900 dark:text-warning-200",
      icon: "text-warning-500 dark:text-warning-400",
    },
    error: {
      bg: "bg-error-50 dark:bg-error-900/20",
      border: "border-error-200 dark:border-error-700",
      text: "text-error-900 dark:text-error-200",
      icon: "text-error-500 dark:text-error-400",
    },
  },
};

export const badgeColorClasses = {
  // Color classes with dark theme support
  colorClasses: {
    primary: {
      default:
        "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700",
      outlined:
        "bg-transparent border-2 text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600",
      filled: "bg-primary-500 text-white border-primary-500",
    },
    success: {
      default:
        "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-200 border-success-200 dark:border-success-700",
      outlined:
        "bg-transparent border-2 text-success-600 dark:text-success-400 border-success-300 dark:border-success-600",
      filled: "bg-success-500 text-white border-success-500",
    },
    warning: {
      default:
        "bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-200 border-warning-200 dark:border-warning-700",
      outlined:
        "bg-transparent border-2 text-warning-600 dark:text-warning-400 border-warning-300 dark:border-warning-600",
      filled: "bg-warning-500 text-white border-warning-500",
    },
    error: {
      default:
        "bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-200 border-error-200 dark:border-error-700",
      outlined:
        "bg-transparent border-2 text-error-600 dark:text-error-400 border-error-300 dark:border-error-600",
      filled: "bg-error-500 text-white border-error-500",
    },
    gray: {
      default:
        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600",
      outlined:
        "bg-transparent border-2 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600",
      filled: "bg-gray-500 text-white border-gray-500",
    },
  },

  // Variant classes with dark theme support
  variantClasses: {
    default:
      "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border-primary-200 dark:border-primary-700",
    outlined:
      "bg-transparent border-2 text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600",
    filled: "bg-primary-500 text-white border-primary-500",
  },
};

// Status Classes
export const statusClasses = {
  // Input status
  input: {
    default:
      "border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400",
    error:
      "border-error-500 dark:border-error-400 focus:border-error-500 dark:focus:border-error-400 focus:ring-error-500 dark:focus:ring-error-400",
    warning:
      "border-warning-500 dark:border-warning-400 focus:border-warning-500 dark:focus:border-warning-400 focus:ring-warning-500 dark:focus:ring-warning-400",
    success:
      "border-success-500 dark:border-success-400 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500 dark:focus:ring-success-400",
  },

  // Avatar status
  avatar: {
    online: "bg-success-500",
    offline: "bg-gray-400",
    away: "bg-warning-500",
    busy: "bg-error-500",
  },

  // General status indicators
  indicator: {
    active: "text-green-600 bg-green-100",
    inactive: "text-gray-600 bg-gray-100",
    pending: "text-yellow-600 bg-yellow-100",
    error: "text-red-600 bg-red-100",
    warning: "text-orange-600 bg-orange-100",
  },

  colorBgClasses: {
    active: "bg-success-500",
    inactive: "bg-gray-400",
    pending: "bg-warning-500",
    success: "bg-success-500",
    error: "bg-error-500",
    warning: "bg-warning-500",
    online: "bg-success-500",
    offline: "bg-gray-400",
    away: "bg-warning-500",
    busy: "bg-error-500",
  },

  textColors: {
    active: "text-success-600",
    inactive: "text-gray-500",
    pending: "text-warning-600",
    success: "text-success-600",
    error: "text-error-600",
    warning: "text-warning-600",
    online: "text-success-600",
    offline: "text-gray-500",
    away: "text-warning-600",
    busy: "text-error-600",
  },

  badgeColors: {
    active: "bg-success-100 text-success-800 border-success-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200",
    pending: "bg-warning-100 text-warning-800 border-warning-200",
    success: "bg-success-100 text-success-800 border-success-200",
    error: "bg-error-100 text-error-800 border-error-200",
    warning: "bg-warning-100 text-warning-800 border-warning-200",
    online: "bg-success-100 text-success-800 border-success-200",
    offline: "bg-gray-100 text-gray-800 border-gray-200",
    away: "bg-warning-100 text-warning-800 border-warning-200",
    busy: "bg-error-100 text-error-800 border-error-200",
  },

  sizeClasses: {
    xs: {
      dot: "w-2 h-2",
      badge: "text-xs px-2 py-0.5",
      text: "text-xs",
      icon: "w-3 h-3",
    },
    sm: {
      dot: "w-3 h-3",
      badge: "text-sm px-2.5 py-0.5",
      text: "text-sm",
      icon: "w-4 h-4",
    },
    md: {
      dot: "w-4 h-4",
      badge: "text-sm px-3 py-1",
      text: "text-base",
      icon: "w-5 h-5",
    },
    lg: {
      dot: "w-5 h-5",
      badge: "text-base px-4 py-1.5",
      text: "text-lg",
      icon: "w-6 h-6",
    },
  },
};

// Shape Classes
export const shapeClasses = {
  // Border radius
  rounded: {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  },

  // Avatar shapes
  avatar: {
    circle: "rounded-full",
    square: "rounded-none",
    rounded: "rounded-lg",
  },
};

export const modalSliderClasses = {
  modalSizeClasses: {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    "6xl": "max-w-6xl",
    full: "max-w-full",
  },
  sliderSizeClasses: {
    xs: "w-80",
    sm: "w-96",
    md: "w-1/3",
    lg: "w-1/2",
    xl: "w-2/3",
    "2xl": "w-3/4",
    "3xl": "w-4/5",
    "4xl": "w-5/6",
    "5xl": "w-11/12",
    "6xl": "w-full",
    full: "w-full",
  },
  // Position classes for modal variant
  modalPositionClasses: {
    center: "items-center justify-center",
    top: "items-start justify-center pt-16",
    bottom: "items-end justify-center pb-16",
    left: "items-center justify-start pl-16",
    right: "items-center justify-end pr-16",
    "top-left": "items-start justify-start pt-16 pl-16",
    "top-right": "items-start justify-end pt-16 pr-16",
    "bottom-left": "items-end justify-start pb-16 pl-16",
    "bottom-right": "items-end justify-end pb-16 pr-16",
  },
};
// Position Classes
export const positionClasses = {
  // Status position for avatars
  status: {
    "top-right": "top-0 right-0",
    "bottom-right": "bottom-0 right-0",
    "top-left": "top-0 left-0",
    "bottom-left": "bottom-0 left-0",
  },

  // Modal positions
  modal: {
    center: "items-center justify-center",
    top: "items-start justify-center pt-16",
    bottom: "items-end justify-center pb-16",
  },

  // Toast positions
  toast: {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
  },
};

// Layout Classes
export const layoutClasses = {
  // Container layouts
  container: {
    default: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    fluid: "w-full px-4 sm:px-6 lg:px-8",
    narrow: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
  },

  // Grid layouts
  grid: {
    cols1: "grid-cols-1",
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },

  // Flex layouts
  flex: {
    center: "flex items-center justify-center",
    between: "flex items-center justify-between",
    start: "flex items-center justify-start",
    end: "flex items-center justify-end",
    col: "flex flex-col",
    colCenter: "flex flex-col items-center justify-center",
  },
};

// Animation Classes
export const animationClasses = {
  // Transitions
  transition: {
    default: "transition-all duration-200 ease-in-out",
    fast: "transition-all duration-150 ease-in-out",
    slow: "transition-all duration-300 ease-in-out",
    colors: "transition-colors duration-200 ease-in-out",
    opacity: "transition-opacity duration-200 ease-in-out",
  },

  // Loading states
  loading: {
    pulse: "animate-pulse",
    spin: "animate-spin",
    bounce: "animate-bounce",
    slow: "animate-spin",
    normal: "animate-spin",
    fast: "animate-spin",
  },

  // Hover effects
  hover: {
    scale: "hover:scale-105 transition-transform duration-200",
    opacity: "hover:opacity-80 transition-opacity duration-200",
    shadow: "hover:shadow-md transition-shadow duration-200",
  },

  // Speed Durations
  speedDurations: {
    slow: "2s",
    normal: "1s",
    fast: "0.5s",
  },
};

// Focus Classes
export const focusClasses = {
  // Focus rings
  ring: {
    default: "focus:outline-none focus:ring-2 focus:ring-opacity-50",
    primary:
      "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50",
    error:
      "focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-opacity-50",
    success:
      "focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-opacity-50",
    warning:
      "focus:outline-none focus:ring-2 focus:ring-warning-500 focus:ring-opacity-50",
  },
};

// State Classes
export const stateClasses = {
  // Disabled states
  disabled: {
    button: "disabled:cursor-not-allowed disabled:opacity-50",
    input:
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-800",
    general: "cursor-not-allowed opacity-50",
  },

  // Loading states
  loading: {
    button: "cursor-wait opacity-75",
    overlay: "pointer-events-none opacity-50",
  },

  // Interactive states
  interactive: {
    clickable: "cursor-pointer",
    hoverable: "hover:bg-gray-50 dark:hover:bg-gray-800",
    selectable:
      "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-700",
  },
};

// Shadow Classes
export const shadowClasses = {
  elevation: {
    none: "shadow-none",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  },
};

// Border Classes
export const borderClasses = {
  width: {
    none: "border-0",
    thin: "border",
    thick: "border-2",
  },

  color: {
    default: "border-gray-200 dark:border-gray-700",
    primary: "border-primary-200 dark:border-primary-700",
    error: "border-error-200 dark:border-error-700",
    success: "border-success-200 dark:border-success-700",
    warning: "border-warning-200 dark:border-warning-700",
  },
};

// Navigation-specific Classes (only variable-defined classes from components)
export const tabVariantClasses = {
  default: {
    container: "border-b-2 border-gray-200 dark:bg-transparent bg-white",
    tab: "border-b-2 border-transparent hover:border-gray-300 hover:text-gray-700 transition-all duration-300 relative",
    active:
      "border-primary-500 dark:text-white text-primary-600 bg-primary-50/30 font-semibold",
    inactive: "text-gray-500 hover:bg-gray-50",
    content:
      "mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100",
  },
  pills: {
    container: "dark:bg-transparent bg-gray-100 rounded-xl p-1.5 shadow-inner",
    tab: "rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium",
    active:
      "dark:bg-transparent bg-white dark:text-white text-gray-900 shadow-md font-semibold ring-1 ring-gray-200",
    inactive: "text-gray-600 hover:text-gray-800",
    content:
      "mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100",
  },
  underline: {
    container: "border-b border-gray-200 dark:bg-transparent bg-white relative",
    tab: "border-b-2 border-transparent hover:border-gray-300 transition-all duration-300 relative group",
    active:
      "border-primary-500 dark:text-white text-primary-600 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-primary-400 after:to-primary-600 after:rounded-full after:shadow-sm",
    inactive: "text-gray-500 hover:text-gray-700",
    content:
      "mt-6 p-4 dark:bg-transparent bg-white rounded-lg shadow-sm border border-gray-100",
  },
  card: {
    container: "bg-gray-50 border-b border-gray-200 p-2 rounded-t-lg",
    tab: "border border-gray-200 border-b-0 rounded-t-lg dark:bg-transparent bg-white hover:bg-gray-50 transition-all duration-300 shadow-sm",
    active:
      "dark:bg-transparent bg-white border-gray-300 dark:text-white text-gray-900 shadow-md font-semibold border-b-2 border-b-white -mb-px z-10 relative",
    inactive: "text-gray-600 hover:text-gray-800 bg-gray-100",
    content:
      "p-6 dark:bg-transparent bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0",
  },
};

export const tabSizeClasses = {
  sm: {
    tab: "text-sm px-3 py-2",
    icon: "w-4 h-4",
    badge: "text-xs px-2 py-0.5",
    close: "w-3 h-3 p-0.5",
    content: "text-sm",
  },
  md: {
    tab: "text-base px-4 py-3",
    icon: "w-5 h-5",
    badge: "text-xs px-2 py-1",
    close: "w-4 h-4 p-1",
    content: "text-base",
  },
  lg: {
    tab: "text-lg px-6 py-4",
    icon: "w-6 h-6",
    badge: "text-sm px-3 py-1",
    close: "w-5 h-5 p-1",
    content: "text-lg",
  },
};

export const menuVariantClasses = {
  default: "bg-white border border-gray-200 rounded-lg shadow-lg",
  compact: "bg-white border border-gray-200 rounded-md shadow-sm",
  sidebar: "bg-white border-r border-gray-200 rounded-none shadow-none",
};

export const menuPlacementClasses = {
  top: "bottom-full mb-2",
  bottom: "top-full mt-2",
  left: "right-full mr-2",
  right: "left-full ml-2",
};

// Feedback-specific Classes (only variable-defined classes from components)
export const toastVariantClasses = {
  info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100",
  success:
    "bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-700 text-success-900 dark:text-success-100",
  warning:
    "bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-700 text-warning-900 dark:text-warning-100",
  error:
    "bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-700 text-error-900 dark:text-error-100",
};

export const toastIconClasses = {
  info: "text-blue-500 dark:text-blue-400",
  success: "text-success-500 dark:text-success-400",
  warning: "text-warning-500 dark:text-warning-400",
  error: "text-error-500 dark:text-error-400",
};

// Spinner-specific Classes
export const spinnerSizeClasses = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

export const colorClasses = {
  primary: "text-primary-600",
  secondary: "text-gray-600",
  success: "text-success-600",
  warning: "text-warning-600",
  danger: "text-error-600",
  muted: "text-gray-400",
  white: "text-white",
  default: "text-gray-700",
  error: "text-error-600",
};

// LoadingState-specific Classes
export const loadingStateSizeClasses = {
  sm: {
    text: "text-sm",
    description: "text-xs",
    spacing: "space-y-2",
  },
  md: {
    text: "text-base",
    description: "text-sm",
    spacing: "space-y-3",
  },
  lg: {
    text: "text-lg",
    description: "text-base",
    spacing: "space-y-4",
  },
};

// Common Form Input Classes (used by CascadingSelect, DatePicker, etc.)
export const formInputSizeClasses = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-base",
  lg: "px-5 py-4 text-lg",
};

export const formInputVariantClasses = {
  default:
    "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800",
  outlined:
    "border-2 border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent",
  filled: "border-0 bg-gray-100 dark:bg-gray-700",
};

export const formInputStatusClasses = {
  default:
    "border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400",
  error:
    "border-error-500 dark:border-error-400 focus:border-error-500 dark:focus:border-error-400 focus:ring-error-500 dark:focus:ring-error-400",
  warning:
    "border-warning-500 dark:border-warning-400 focus:border-warning-500 dark:focus:border-warning-400 focus:ring-warning-500 dark:focus:ring-warning-400",
  success:
    "border-success-500 dark:border-success-400 focus:border-success-500 dark:focus:border-success-400 focus:ring-success-500 dark:focus:ring-success-400",
};

// Layout Classes (used by templates and molecules)
export const layoutSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

export const layoutVariantClasses = {
  vertical: "space-y-6",
  horizontal: "space-y-4",
  compact: "space-y-3",
};

export const containerSizeClasses = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-4xl",
};

export const gridLayoutClasses = {
  "single-column": "grid-cols-1",
  "two-column": "grid-cols-1 md:grid-cols-2",
  "three-column": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};
