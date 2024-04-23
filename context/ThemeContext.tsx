import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// Provide a default value that matches the structure of ThemeContextType
const defaultContextValue: ThemeContextType = {
  theme: 'light', // default theme
  toggleTheme: () => {}, // default function
};

export const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
