import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Fitness Tracker
        </h1>
        <p className="mt-4 text-2xl text-white shadow-lg">
          Keep track of your exercise routine and compete with friends!
        </p>
      </div>

      <div className="mt-12 flex space-x-6">
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
      </div>        

      <footer className="absolute bottom-4 text-center text-white">
        <p>© 2024 Fitness Tracker. All rights reserved.</p>
      </footer>
    </main>
  );
}
