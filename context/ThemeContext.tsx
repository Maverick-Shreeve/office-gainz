import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the context state
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// export context
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//  provider component
export const ThemeProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// hook for child components to get the theme and re-render when it changes
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
