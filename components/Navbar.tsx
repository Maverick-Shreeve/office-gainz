import { useEffect, useState } from 'react';
import Link from 'next/link';

import { useRouter } from 'next/router';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Function to fetch login status from the server
    const fetchLoginStatus = async () => {
      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include', // gets cookies
        });
        const data = await response.json();
        setIsLoggedIn(data.isLoggedIn);
      } catch (error) {
        console.error('Failed to fetch login status:', error);
      }
    };

    fetchLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', 
      });
      if (response.ok) {
        setIsLoggedIn(false);
          // redirect to home 
          router.push('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white w-full">
      <div className="max-w-screen-lg mx-auto px-4 flex justify-between">
        <ul className="flex">
          <li>
            <Link href="/">Home</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link href="/progress" passHref><span className="cursor-pointer">Progress</span></Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li>
              <Link href="/login" passHref><span className="cursor-pointer">Login</span></Link>
            </li>
          )}
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
