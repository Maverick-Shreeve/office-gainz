// pages/index.tsx

import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
        Fitness Tracker
      </h1>
      <p className="mt-3 text-xl text-gray-600 dark:text-gray-300">
        Keep track of your exercise routine and compete with friends!
      </p>

      <div className="mt-8 space-x-4">
        {/* Update Link usage according to new Next.js standards */}
        <Link href="/record">
          <button className="rounded-md bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-800">
            Record Exercise
          </button>
        </Link>

        <Link href="/progress">
          <button className="rounded-md bg-green-500 py-2 px-4 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 dark:focus:ring-green-800">
            View Progress
          </button>
        </Link>
      </div>

      {/* Optionally, if you want to display a logo or an image */}
      <div className="mt-12">
        <Image
          src="/your-logo.png" // Replace with your logo's path
          alt="Your Logo"
          width={150}
          height={150}
          priority
        />
      </div>
    </main>
  )
}
