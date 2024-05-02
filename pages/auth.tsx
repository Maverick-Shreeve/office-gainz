import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { supabase } from '../utils/supabaseClient'; 

type FormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
    // Add your logic to handle login or registration here
  };

  const handleSignInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',  // Requests a refresh token
            prompt: 'consent'        // Forces the consent screen to show
          }
        }
      });
  
      if (error) {
        const typedError = error as { message?: string, error_description?: string };
        console.error("Google auth error:", typedError.message);
        setErrorMessage(typedError.message || "An unknown error occurred");
      }
    } catch (error: any) {
      console.error("Unexpected error during Google auth:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        const typedError = error as { error_description?: string, message?: string };
        setErrorMessage(typedError.error_description || typedError.message || "An unknown error occurred");
      }
    }
  };

  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Sign Up"} Page</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
          
          <button onClick={handleSignInWithGoogle} className="w-full bg-red-500 text-white p-2 mt-4 rounded">
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center mt-4 text-sm text-blue-500"
          >
            {isLogin ? "Need an account? Sign Up" : "Already have an account? Login"}
          </button>
        </form>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </>
  );
}
