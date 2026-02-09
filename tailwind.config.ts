import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class", "dark"], // Ajustado para o padrão mais comum do shadcn/next-themes
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        // Certifique-se de configurar as variáveis --font-lato e --font-playfair no seu layout.tsx/globals.css
        sans: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        // Paleta Específica do Decmobly
        wood: {
          DEFAULT: '#5c4d3c',
          50: '#f4f2ef',
          100: '#e3dfd7',
          200: '#c5b5b0', // CORRIGIDO (era #c5bkb0)
          300: '#a39282',
          400: '#847361',
          500: '#6a5a4a',
          600: '#5c4d3c', // Cor Principal
          700: '#4d3f32',
          800: '#41362d',
          900: '#382f28',
        },
        cream: {
          DEFAULT: '#fdfbf7',
          50: '#ffffff',
          100: '#fdfbf7', // Cor de Fundo
          200: '#f7f1e3', // Cor de Seção
          300: '#efe4cd', // Cor de Borda
        },
        
        // Mapeamento do Shadcn UI
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        'search-float': {
          '0%, 100%': { transform: 'translate(0px, 0px) rotate(0deg)' },
          '25%': { transform: 'translate(15px, -15px) rotate(5deg)' },
          '50%': { transform: 'translate(0px, -20px) rotate(-5deg)' },
          '75%': { transform: 'translate(-15px, -15px) rotate(5deg)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'search-float': 'search-float 8s ease-in-out infinite',
      }
    }
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config

export default config