import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the screen width is mobile size
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className={`relative w-full ${isMobile ? 'h-[90vh]' : 'h-full'}`}>
          <Image 
            src="/pushupBG.jpeg" 
            alt="Background" 
            fill
            style={{ 
              objectFit: 'cover', 
              objectPosition: isMobile ? 'center 10%' : 'center' // Drastically change the position to shift focus
            }} 
            className={`opacity-80 ${isMobile ? 'min-h-[90vh]' : ''}`} // Maintain image height on mobile
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-radial-fade"></div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-extrabold text-white">
          Fitness Tracker
        </h1>
        <p className="mt-4 text-3xl text-white">
          Keep track of your exercise routine and compete with friends!
        </p>
      </div>

      <div className="relative z-10 mt-12 flex flex-col items-center space-y-4 px-4">
        <Link href="/record" legacyBehavior>
          <a className="transform transition duration-500 hover:scale-110">
            <button className="rounded-full bg-blue-600 py-3 px-6 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
              Record Exercise
            </button>
          </a>
        </Link>

        <Link href="/progress" legacyBehavior>
          <a className="transform transition duration-500 hover:scale-110">
            <button className="rounded-full bg-green-600 py-3 px-6 text-lg font-semibold text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800">
              View Progress
            </button>
          </a>
        </Link>

        <Link href="/leaderboard" legacyBehavior>
          <a className="transform transition duration-500 hover:scale-110">
            <button className="rounded-full bg-blue-600 py-3 px-6 text-lg font-semibold text-white hover:bg-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">
              Leaderboard
            </button>
          </a>
        </Link>
      </div>        
    </main>
  );
}
