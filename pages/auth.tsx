import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm } from "react-hook-form";
import React from 'react';
import { useAuth } from '../context/AuthContext';

type FormData = {
  email: string;
  password: string;
};

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>(); // use the Formdata type for useform hook
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();

  const onSubmit = async (data: FormData) => {
    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result: { user: any; token: string } = await response.json();
        console.log("Response:", result);
        setIsLoggedIn(true);
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMessage("Network error or server is not responding");
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
