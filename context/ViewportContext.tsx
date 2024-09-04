import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface ViewportContextType {
  isMobile: boolean;
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined);

export const ViewportProvider = ({ children }: { children: ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ViewportContext.Provider value={{ isMobile }}>
      {children}
    </ViewportContext.Provider>
  );
};

export const useViewport = () => {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider');
  }
  return context;
};
