import Head from "next/head";
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const About = () => {
  const themeContext = useContext(ThemeContext);

  if (!themeContext) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { theme } = themeContext;

  return (
    <>
      <Head>
        <title>About Us</title>
        <meta name="description" content="Learn more about what we do" />
      </Head>

      <div className={`min-h-screen p-5 ${theme === 'dark' ? 'bg-dark-background text-white' : 'bg-white text-black'}`}>
        <div className="max-w-4xl mx-auto p-5 bg-white rounded-lg shadow dark:bg-dark-card dark:text-white">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">About Us</h1>
          <p className="mb-4">
            Welcome to Office-Gainz, your ultimate partner in tracking your
            fitness journey while you manage your busy work schedule. Our mission
            is to make fitness accessible and manageable for everyone, especially
            for those who spend a lot of time in office environments.
          </p>
          <p className="mb-4">
            Our platform offers a variety of tools to help you record your
            workouts, track your progress, and stay motivated. Whether you're just
            starting out on your fitness journey or you're looking to take your
            training to the next level, Office-Gainz has something for you.
          </p>
          <p className="mb-4">
            Join our community today and start making gains that matter!
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
