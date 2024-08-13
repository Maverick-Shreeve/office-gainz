import { useEffect } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Callback page loaded");

      // Parse the hash fragment to get the tokens
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const idToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!idToken || !refreshToken) {
        console.error("Authorization tokens not found");
        return;
      }

      console.log("ID Token:", idToken);
      console.log("Refresh Token:", refreshToken);

      // Store tokens in localStorage or sessionStorage
      localStorage.setItem("id_token", idToken);
      localStorage.setItem("refresh_token", refreshToken);

      console.log("Tokens stored successfully.");

      // Redirect to the desired page
      router.replace("/"); // Adjust this path as necessary
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router.isReady]);

  return <p>Loading...</p>;
};

export default Callback;
