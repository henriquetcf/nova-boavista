import type { Config } from "tailwindcss";

const config: Config = {
  // Ativa o Dark Mode baseado em uma classe no HTML (essencial para o nosso botão funcionar)
  darkMode: "class",
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  
  theme: {
    extend: {
      colors: {
        // Você pode centralizar suas cores aqui se quiser
        brand: {
          purple: "#E8DEF8",
          dark: "#1D192B",
          gray: "#49454F",
        }
      },
      // Adicionando as animações que usamos no Dropdown e Indicadores
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        }
      },
      animation: {
        shake: "shake 0.3s ease-in-out",
        "in": "fade-in 0.2s ease-out",
        "zoom": "zoom-in 0.2s ease-out",
      }
    },
  },
  plugins: [
    // Se você instalou o tailwindcss-animate, adicione aqui
    // require("tailwindcss-animate"),
  ],
};

export default config;