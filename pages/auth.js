import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script'; // Import Script component

export default function AuthPage() {
    // Declare state variables
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState('');

  

   // This function will be called when the Google sign-in is successful
   const handleCredentialResponse = (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // Send this token to your server for verification
    // ... (send token to your server, set user session, etc.)
  };

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLogin) {
      // Logic for logging in
      console.log('Logging in:', { email, password });
      // You would replace this with an actual API call
    } else {
      // Logic for signing up
      console.log('Signing up:', { email, password });
      // You would replace this with an actual API call
    }
  };


  return (
    <>
      <Head>
        <title>Auth Page</title>
      </Head>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => {
          window.google.accounts.id.initialize({
            client_id: '141127413397-bclfrqc9tk5gk65058dooumki75hjnme.apps.googleusercontent.com', 
            callback: handleCredentialResponse
          });
          window.google.accounts.id.renderButton(
            document.getElementById('g-signin2'), // where to render the button
            { theme: 'outline', size: 'large' }  // button customization
          );
        }}
      />

      <div className="min-h-screen flex flex-col items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center mt-4 text-sm text-blue-500"
          >
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Login'}
          </button>
        </form>

        {/* Google Sign-in button */}
        <div id="g-signin2"></div>
      </div>
    </>
  );
}