import { useEffect, useContext } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { supabase } from '../utils/supabaseClient';

const Navbar = () => {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const { isLoggedIn, setIsLoggedIn } = useAuth(); 

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = themeContext;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Sync auth state with Supabase session 
  useEffect(() => {
    const checkAuthState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuthState();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setIsLoggedIn]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      console.log("Logged out successfully.");
      setIsLoggedIn(false); 
      router.push("/"); 
    } catch (error) {
      if (error instanceof Error) {
        console.error("Logout failed:", error.message);
      } else {
        console.error("Logout failed:", "An unknown error occurred");
      }
    }
  };

  return (
    <nav className="bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 dark:bg-dark-card border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 rounded relative z-20">
      <div className="container flex flex-wrap justify-between items-center mx-auto dark:bg-dark-card">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer dark:bg-dark-card p-2 rounded">
            <div className="overflow-hidden h-12 sm:h-14 w-12 sm:w-14 rounded-full">
              <img
                src="/office-gainzlogo.jpg"
                alt="Office Gainz Logo"
                className="object-cover object-center h-full w-full transform scale-1.5"
              />
            </div>
            <span className="ml-3 self-center text-xl font-semibold whitespace-nowrap dark:text-dark-text">
              Office Gainz
            </span>
          </div>
        </Link>
        <div className="flex md:order-2">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 mr-3 md:mr-0"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth" passHref>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-3 md:mr-0 flex items-center justify-center">
                Sign In
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6 ml-2" />
              </button>
            </Link>
          )}
        </div>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-white dark:bg-dark-card dark:border-gray-700">
            <li>
              <Link href="/" passHref>
                <span className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-dark-text md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about" passHref>
                <span className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-dark-text md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer">
                  About
                </span>
              </Link>
            </li>
            <div className="relative group cursor-pointer ml-auto" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <>
                  <LightModeIcon className="text-yellow-500" />
                  <span className="absolute -top-1 -translate-y-full left-1/2 transform -translate-x-1/2 w-auto px-1 py-0.5 text-[9px] leading-tight font-medium text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    Switch to Light
                  </span>
                </>
              ) : (
                <>
                  <DarkModeIcon className="text-gray-800 dark:text-gray-200" />
                  <span className="absolute -top-1 -translate-y-full left-1/2 transform -translate-x-1/2 w-auto px-1 py-0.5 text-[9px] leading-tight font-medium text-white bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                    Switch to Dark
                  </span>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
