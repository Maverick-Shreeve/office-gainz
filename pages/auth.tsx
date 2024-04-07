import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm } from "react-hook-form";
import React from 'react';
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
    const action = isLogin ? "signIn" : "signUp";
    try {
      let result;
      if (action === "signIn") {
        result = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
      } else {
        result = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
      }

      // Destructure `data` from `result` and then `user` from `data`
      const { data: { user }, error } = result;

      if (error) {
        throw error;
      }

      if (user) {
        console.log("Success:", user);
        router.push("/"); 
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
  
      if (error instanceof Error) {
        console.error("Auth error:", error.message);
        setErrorMessage(error.message);
      } else {
        console.error("An unknown error occurred");
        setErrorMessage("An unknown error occurred");
      }
    }
  };


  return (
    <>
      <Head>
        <title>{isLogin ? "Login" : "Sign Up"} Page</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xs">
          <input
            type="email"
            {...register("email", { required: true })}
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          {errors.email && <p className="text-red-500">Email is required.</p>}
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
          {errors.password && <p className="text-red-500">Password is required.</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            {isLogin ? "Login" : "Sign Up"}
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
