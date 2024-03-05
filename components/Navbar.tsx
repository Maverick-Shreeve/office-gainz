import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const themeContext = useContext(ThemeContext);
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = themeContext;

  useEffect(() => {
    //  apply the current theme on component mount
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchLoginStatus = async () => {
      try {
        const response = await fetch("/api/auth/status", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error("Failed to fetch login status:", error);
      }
    };
    fetchLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(false); 
        router.push("/"); // redirect to home
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2.5 rounded">

      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link href="/" passHref>
          <div className="flex items-center cursor-pointer">
            <img
              src="https://logos-download.com/wp-content/uploads/2016/03/Pepsi_Logo_1997.svg"
              className="mr-3 h-6 sm:h-9"
              alt="Logo"
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              OFFICE-GAINZ
            </span>
          </div>
        </Link>
        <div className="flex md:order-2">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 mr-3 md:mr-0">
              Logout
            </button>
          ) : (
  
            <Link href="/auth" passHref>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mr-3 md:mr-0">
                Login / Create Account
              </button>
            </Link>
          )}
        </div>
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col p-4 mt-4 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link href="/" passHref>
                <span className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link href="/about" passHref>
                <span className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent cursor-pointer">
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
                    Switch to superior dark mode
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
