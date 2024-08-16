import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";

const Callback = () => {
  const router = useRouter();
  const { setIsLoggedIn } = useAuth(); //setIsLoggedIn function from context

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("Callback page loaded");

      // Parse the hash fragment to get the tokens
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);

      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (!accessToken || !refreshToken) {
        console.error("Authorization tokens not found");
        return;
      }

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      // Update the global auth state
      setIsLoggedIn(true);

      router.replace(`/`);
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router.isReady, setIsLoggedIn]);

  return <p>Loading...</p>;
};

export default Callback;
