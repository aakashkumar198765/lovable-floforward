import { DesignTokens } from '../types';

export const designTokens: DesignTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  spacing: {
    '1': '0.25rem', // 4px
    '2': '0.5rem',  // 8px
    '3': '0.75rem', // 12px
    '4': '1rem',    // 16px
    '5': '1.25rem', // 20px
    '6': '1.5rem',  // 24px
    '8': '2rem',    // 32px
    '10': '2.5rem', // 40px
    '12': '3rem',   // 48px
    '16': '4rem',   // 64px
    '20': '5rem',   // 80px
  },
  borderRadius: {
    'none': '0',
    'sm': '0.125rem', // 2px
    'md': '0.375rem', // 6px
    'lg': '0.5rem',   // 8px
    'xl': '0.75rem',  // 12px
    '2xl': '1rem',    // 16px
    'full': '9999px',
  },
  fontFamily: {
    'work-sans': ['Work Sans', 'sans-serif'],
    'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
  },
  fontSize: {
    'xs': '0.75rem',   // 12px
    'sm': '0.875rem',  // 14px
    'base': '1rem',    // 16px
    'lg': '1.125rem',  // 18px
    'xl': '1.25rem',   // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  fontWeight: {
    'light': '300',
    'normal': '400',
    'medium': '500',
    'semibold': '600',
    'bold': '700',
  },
  boxShadow: {
    'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    'none': 'none',
  },
};

// CSS Custom Properties for design tokens with dark theme support
export const cssCustomProperties = `
  :root {
    /* Colors - Primary */
    --color-primary-50: 239 246 255;
    --color-primary-100: 219 234 254;
    --color-primary-200: 191 219 254;
    --color-primary-300: 147 197 253;
    --color-primary-400: 96 165 250;
    --color-primary-500: 59 130 246;
    --color-primary-600: 37 99 235;
    --color-primary-700: 29 78 216;
    --color-primary-800: 30 64 175;
    --color-primary-900: 30 58 138;

    /* Colors - Gray (Light theme) */
    --color-gray-50: 249 250 251;
    --color-gray-100: 243 244 246;
    --color-gray-200: 229 231 235;
    --color-gray-300: 209 213 219;
    --color-gray-400: 156 163 175;
    --color-gray-500: 107 114 128;
    --color-gray-600: 75 85 99;
    --color-gray-700: 55 65 81;
    --color-gray-800: 31 41 55;
    --color-gray-900: 17 24 39;

    /* Semantic Colors - Light theme */
    --color-background: 255 255 255;
    --color-foreground: 17 24 39;
    --color-card: 255 255 255;
    --color-card-foreground: 17 24 39;
    --color-popover: 255 255 255;
    --color-popover-foreground: 17 24 39;
    --color-muted: 243 244 246;
    --color-muted-foreground: 107 114 128;
    --color-accent: 243 244 246;
    --color-accent-foreground: 17 24 39;
    --color-border: 229 231 235;
    --color-input: 229 231 235;
    --color-ring: 147 197 253;
  }

  .dark {
    /* Colors - Gray (Dark theme - inverted) */
    --color-gray-50: 17 24 39;
    --color-gray-100: 31 41 55;
    --color-gray-200: 55 65 81;
    --color-gray-300: 75 85 99;
    --color-gray-400: 156 163 175;
    --color-gray-500: 107 114 128;
    --color-gray-600: 209 213 219;
    --color-gray-700: 229 231 235;
    --color-gray-800: 243 244 246;
    --color-gray-900: 249 250 251;

    /* Semantic Colors - Dark theme */
    --color-background: 3 7 18;
    --color-foreground: 249 250 251;
    --color-card: 3 7 18;
    --color-card-foreground: 249 250 251;
    --color-popover: 3 7 18;
    --color-popover-foreground: 249 250 251;
    --color-muted: 31 41 55;
    --color-muted-foreground: 156 163 175;
    --color-accent: 31 41 55;
    --color-accent-foreground: 249 250 251;
    --color-border: 55 65 81;
    --color-input: 55 65 81;
    --color-ring: 147 197 253;
  }

    /* Colors - Success */
    --color-success-50: 236 253 245;
    --color-success-100: 209 250 229;
    --color-success-200: 167 243 208;
    --color-success-300: 110 231 183;
    --color-success-400: 52 211 153;
    --color-success-500: 16 185 129;
    --color-success-600: 5 150 105;
    --color-success-700: 4 120 87;
    --color-success-800: 6 95 70;
    --color-success-900: 6 78 59;

    /* Colors - Warning */
    --color-warning-50: 255 251 235;
    --color-warning-100: 254 243 199;
    --color-warning-200: 253 230 138;
    --color-warning-300: 252 211 77;
    --color-warning-400: 251 191 36;
    --color-warning-500: 245 158 11;
    --color-warning-600: 217 119 6;
    --color-warning-700: 180 83 9;
    --color-warning-800: 146 64 14;
    --color-warning-900: 120 53 15;

    /* Colors - Error */
    --color-error-50: 254 242 242;
    --color-error-100: 254 226 226;
    --color-error-200: 254 202 202;
    --color-error-300: 252 165 165;
    --color-error-400: 248 113 113;
    --color-error-500: 239 68 68;
    --color-error-600: 220 38 38;
    --color-error-700: 185 28 28;
    --color-error-800: 153 27 27;
    --color-error-900: 127 29 29;

    /* Spacing */
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;

    /* Border Radius */
    --radius-none: 0;
    --radius-sm: 0.125rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-full: 9999px;

    /* Font Family */
    --font-work-sans: 'Work Sans', sans-serif;
    --font-mono: ui-monospace, SFMono-Regular, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

    /* Font Size */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;

    /* Font Weight */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Box Shadow */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    --shadow-none: none;
  }
`;

export default designTokens;