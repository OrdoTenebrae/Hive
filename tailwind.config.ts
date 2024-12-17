import type { Config } from "tailwindcss";
import { colors } from './src/styles/colors'
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          dark: "hsl(var(--primary-dark))",
          medium: "hsl(var(--primary-medium))",
          light: "hsl(var(--primary-light))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        }
      },
      borderRadius: {
        lg: '0.625rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      boxShadow: {
        subtle: '0 2px 4px rgba(0,0,0,0.05)',
        medium: '0 4px 6px rgba(0,0,0,0.07)',
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))"
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
