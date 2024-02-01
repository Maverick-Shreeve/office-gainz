import { useEffect, useState } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex justify-between">
        <li>
          <Link href="/"><a>Home</a></Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link href="/progress"><a>Progress</a></Link>
            </li>
            {/* Other links for logged-in users */}
            <li>
              <button onClick={() => { localStorage.clear(); setIsLoggedIn(false); }}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <Link href="/login"><a>Login</a></Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
