import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';

interface User {
  id: string;
  email: string | undefined;  // allow to be undefined so it matches with supabase
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  

 useEffect(() => {
  async function fetchUser() {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
        return;
      }

      if (data.user) {
        const safeUser: User = {
          id: data.user.id,
          email: data.user.email || '' 
        };
        setUser(safeUser);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      setIsLoggedIn(false);
    }
  }

  fetchUser();

  const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
    // Optionally refresh user details on auth state changes
    await fetchUser();
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
