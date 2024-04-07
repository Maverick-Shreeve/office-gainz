import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {supabase} from '../utils/supabaseClient'; 
interface AuthContextType {
  user: any; // Adjust the type according to your user model or set to 'null' for no user
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null); // Adjust 'any' to your user model as needed
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Listen for changes on authentication state
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);
    });

    // Check for an existing session and update state accordingly
    
    const session = supabase.auth.session();
    setUser(session?.user || null);
    setIsLoggedIn(!!session?.user);

    // Perform cleanup
    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};