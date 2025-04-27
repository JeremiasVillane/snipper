import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      header: ["Raleway", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors: {
        "hero-gradient-from": "rgba(25, 64, 174, 0.95)",
        "hero-gradient-to": "rgba(45, 47, 144, 0.93)",
        "hero-gradient-dark-from": "rgba(4, 17, 54, 0.95)",
        "hero-gradient-dark-to": "rgba(21, 22, 69, 0.93)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translate(10px, 10px) scale(0.95)",
          },
          to: { opacity: "1", transform: "translate(10px, 10px) scale(1)" },
        },
        "toast-fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        "toast-slide-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "toast-slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "toast-slide-left": {
          "0%": {
            opacity: "0",
            transform: "translateX(100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "toast-slide-right": {
          "0%": {
            opacity: "0",
            transform: "translateX(-100%)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        "toast-zoom-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.8)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "toast-fade-out": {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        "toast-slide-out-up": {
          from: {
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            opacity: "0",
            transform: "translateY(-100%)",
          },
        },
        "toast-slide-out-down": {
          from: {
            opacity: "1",
            transform: "translateY(0)",
          },
          to: {
            opacity: "0",
            transform: "translateY(100%)",
          },
        },
        "toast-slide-out-right": {
          from: {
            opacity: "1",
            transform: "translateX(0)",
          },
          to: {
            opacity: "0",
            transform: "translateX(100%)",
          },
        },
        "toast-slide-out-left": {
          from: {
            opacity: "1",
            transform: "translateX(0)",
          },
          to: {
            opacity: "0",
            transform: "translateX(-100%)",
          },
        },
        "toast-zoom-out": {
          from: {
            opacity: "1",
            transform: "scale(1)",
          },
          to: {
            opacity: "0",
            transform: "scale(0.8)",
          },
        },
        "toast-progress-bar-decrease": {
          from: {
            width: "100%",
          },
          to: {
            width: "0%",
          },
        },
        "card-shine": {
          "0%": {
            "background-position": "0% 0%",
          },
          "50%": {
            "background-position": "100% 100%",
          },
          to: {
            "background-position": "0% 0%",
          },
        },
        aurora: {
          "0%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
          "25%": {
            backgroundPosition: "50% 100%",
            transform: "rotate(5deg) scale(1.1)",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            transform: "rotate(-3deg) scale(0.95)",
          },
          "75%": {
            backgroundPosition: "50% 0%",
            transform: "rotate(3deg) scale(1.05)",
          },
          "100%": {
            backgroundPosition: "0% 50%",
            transform: "rotate(-5deg) scale(0.9)",
          },
        },
        "check-appear": {
          "0%": {
            height: "0",
            transform: "translateY(-100%)",
          },
          "100%": {
            height: "100%",
            transform: "translateY(0)",
          },
        },
        "check-flip": {
          "0%": {
            transform: "rotateY(90deg)",
          },
          "100%": {
            transform: "rotateY(0)",
          },
        },
        "check-unflip": {
          "0%": {
            transform: "rotateY(0)",
          },
          "100%": {
            transform: "rotateY(90deg)",
          },
        },
        "check-impulse": {
          "0%": {
            opacity: "0",
            transform: "scale(0)",
            transition: "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1.5)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1.3)",
          },
        },
        "check-fill": {
          "0%": {
            position: "absolute",
            transform: "rotateZ(45deg)",
            top: "-52px",
            left: "-52px",
          },
          "100%": {
            position: "absolute",
            transform: "rotateZ(-90deg)",
            top: "-10px",
            left: "-10px",
          },
        },
        "check-unfill": {
          "0%": {
            position: "absolute",
            transform: "rotateZ(-90deg)",
            top: "-10px",
            left: "-10px",
          },
          "100%": {
            position: "absolute",
            transform: "rotateZ(45deg)",
            top: "-52px",
            left: "-52px",
          },
        },
        "check-draw": {
          "0%": { "stroke-dashoffset": "-24" },
          "100%": { "stroke-dashoffset": "0" },
        },
        "check-erase": {
          "0%": { "stroke-dashoffset": "0" },
          "100%": { "stroke-dashoffset": "-24" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.1s ease-out",
        "toast-fade-in": "toast-fade-in 0.3s ease-out forwards",
        "toast-slide-down": "toast-slide-down 0.3s ease-out forwards",
        "toast-slide-up": "toast-slide-up 0.3s ease-out forwards",
        "toast-slide-left": "toast-slide-left 0.3s ease-out forwards",
        "toast-slide-right": "toast-slide-right 0.3s ease-out forwards",
        "toast-zoom-in": "toast-zoom-in 0.3s ease-out forwards",
        "toast-fade-out": "toast-fade-out 0.3s ease-in forwards",
        "toast-slide-out-up": "toast-slide-out-up 0.3s ease-in forwards",
        "toast-slide-out-down": "toast-slide-out-down 0.3s ease-in forwards",
        "toast-slide-out-right": "toast-slide-out-right 0.3s ease-in forwards",
        "toast-slide-out-left": "toast-slide-out-left 0.3s ease-in forwards",
        "toast-zoom-out": "toast-zoom-out 0.3s ease-in forwards",
        "toast-progress-bar": "toast-progress-bar-decrease linear forwards",
        "card-shine": "card-shine 21s infinite linear",
        aurora: "aurora 8s ease-in-out infinite alternate",
        "check-appear": "check-appear 0.2s ease-out forwards",
        "check-flip": "check-flip 0.3s ease-out",
        "check-unflip": "check-unflip 0.1s",
        "check-impulse": "check-impulse 0.3s",
        "check-fill": "check-fill 0.25s ease-in",
        "check-unfill": "check-unfill 0.3s ease-out",
        "check-draw": "check-draw 0.3s ease-out forwards",
        "check-erase": "check-erase 0.2s ease-in forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
