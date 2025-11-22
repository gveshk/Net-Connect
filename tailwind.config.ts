import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: "#00ff9d",
                secondary: "#bd00ff",
                accent: "#00d8ff",
                surface: "#1a1a1a",
                "surface-highlight": "#2a2a2a",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
                'pulse-glow': 'pulse-glow 2s infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(0, 255, 157, 0.2)' },
                    '50%': { boxShadow: '0 0 25px rgba(0, 255, 157, 0.5)' },
                },
                'gradient-x': {
                    '0%, 100%': {
                        'background-size': '200% 200%',
                        'background-position': 'left center'
                    },
                    '50%': {
                        'background-size': '200% 200%',
                        'background-position': 'right center'
                    },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
        },
    },
    plugins: [],
};
export default config;
