import { useEffect } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();

  // env var doesnt want to load
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://office-gainz.vercel.app";

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Callback page loaded");
      console.log("Base URL:", baseUrl);

      // Parse the hash fragment to get the tokens
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const idToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!idToken || !refreshToken) {
        console.error("Authorization tokens not found");
        return;
      }

      // Store tokens in local
      localStorage.setItem("id_token", idToken);
      localStorage.setItem("refresh_token", refreshToken);

      router.replace(`${baseUrl}/`);
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router.isReady]);

  return <p>Loading...</p>;
};

export default Callback;
