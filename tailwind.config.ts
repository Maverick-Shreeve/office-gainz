import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Define your color palette for dark mode here
        dark: {
          background: '#1F2937', 
          text: '#F9FAFB',       
          card: '#2D3748',       
          primary: '#4A5568',    // Dark mode primary color
          secondary: '#718096',  // Dark mode secondary color
        },
        light: {
          background: '#F9FAFB',
          text: '#1A202C',      
          card: '#FFFFFF',       
          primary: '#4299E1',    
          secondary: '#EDF2F7',  
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
