import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useForm } from 'react-hook-form';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';

type FormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    console.log("Form submitted:", data);
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
        <title>Sign In</title>
      </Head>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        <div className="absolute inset-0 overflow-hidden">
          <div className="relative w-full h-full">
            <Image 
              src="/pushupBG.jpeg" 
              alt="Background" 
              fill
              style={{ objectFit: 'cover' }} 
              className="opacity-50"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-radial-fade"></div>
            </div>
          </div>
        </div>

        {/* Content container */}
        <div className="relative z-10 text-center p-8 bg-white bg-opacity-90 rounded shadow-lg w-full max-w-md">
          <h1 className="text-4xl font-bold mb-6">Sign In</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md">
            <button 
              type="button" 
              onClick={handleSignInWithGoogle} 
              className="w-full bg-red-500 text-white p-3 mt-6 rounded flex items-center justify-center text-lg">
              Sign in with 
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png" 
                alt="Google" 
                className="w-6 h-6 ml-3" 
              />
            </button>
          </form>
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
      </div>
    </>
  );
}
