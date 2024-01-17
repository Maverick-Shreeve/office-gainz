import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';


export default function AuthPage() {
    // Declare state variables
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');   
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const userData = { email, password };

    try {
        const response = await fetch(endpoint, {
          method:'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Response:', data);

            // Store the user/token in local storage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);

            // Redirect to the homepage 
            router.push('/')

        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
            setErrorMessage(errorData.message);
        }
    } catch (error) {
        console.error('Request failed:', error);
        setErrorMessage('Network error or server is not responding');
    }
}


  return (
    <>
      
      <Head>
        <title>{isLogin ? 'Login' : 'Sign Up'} Page</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
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
      </div>   
    </>
  );
}