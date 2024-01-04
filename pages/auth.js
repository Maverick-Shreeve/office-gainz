import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script'; // Import Script component

export default function AuthPage() {
    // Declare state variables
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState('');

  useEffect(() => {
    // Listen for the custom event to be dispatched by the onSuccess function
    const handleGoogleSignIn = (event) => {
      handleGoogleSuccess(event.detail);
    };

    window.addEventListener('google-sign-in', handleGoogleSignIn);

    return () => {
      window.removeEventListener('google-sign-in', handleGoogleSignIn);
    };
  }, []);

  // This function will be called when the Google sign-in is successful
  const handleGoogleSuccess = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log("Google User ID: " + profile.getId());
    // Send this token to your server for verification
    const id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
    // ... (send token to your server, set user session, etc.)
  };

  useEffect(() => {
    // Listen for the custom event to be dispatched by the onSuccess function
    const handleGoogleSignIn = (event) => {
      handleGoogleSuccess(event.detail);
    };

    window.addEventListener('google-sign-in', handleGoogleSignIn);

    return () => {
      window.removeEventListener('google-sign-in', handleGoogleSignIn);
    };
  }, []);

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
        
      </Head>

      <Script
        src="https://apis.google.com/js/platform.js"
        onLoad={() => {
          window.gapi.load('auth2', function() {
            window.gapi.auth2.init({
              client_id: 'YOUR_CLIENT_ID',
              // Add other initialization parameters if needed
            }).then(() => {
              window.gapi.signin2.render('g-signin2', {
                'scope': 'profile email',
                'width': 240,
                'height': 50,
                'longtitle': true,
                'theme': 'dark',
                'onsuccess': onSuccess,
                'onfailure': onFailure
              });
            });
          });
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

// Outside your component
function onSuccess(googleUser) {
  window.dispatchEvent(new CustomEvent('google-sign-in', { detail: googleUser }));
}

function onFailure(error) {
  console.error('Google Sign In Failure:', error);
}
