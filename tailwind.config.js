/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        h0: ["48px", { lineHeight: "48px", letterSpacing: "0.02em" }],
        h1: ["40px", { lineHeight: "48px", letterSpacing: "0.02em" }],
        h2: ["28px", { lineHeight: "36px", letterSpacing: "0.01em" }],
        h3: ["22px", { lineHeight: "24px", letterSpacing: "0.01em" }],
        body: ["16px", { lineHeight: "24px", letterSpacing: "0em" }],
        button: ["18px", { lineHeight: "22px", letterSpacing: "0.015em" }],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "#05A9A9", // Your primary color
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "#767676", // Your muted text color
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      spacing: {
        "2r": "8px",
        "4r": "16px",
        "6r": "24px",
        "8r": "32px",
        "16r": "64px",
      },
      screens: {
        "sm-phone": "350px",
        "3xl": "1600px",
        "4xl": "1920px",
      },
    },
    fontFamily: {
      sans: ["Outfit", "sans-serif"],
    },
  },
  plugins: [require("tailwindcss-animate")],
};
