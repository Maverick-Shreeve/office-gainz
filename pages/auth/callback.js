import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";

const Callback = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Callback page loaded");

        // Extract the tokens from the URL hash
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        console.log("URL Hash:", hash);
        console.log("Extracted Access Token:", accessToken);
        console.log("Extracted Refresh Token:", refreshToken);

        if (!accessToken || !refreshToken) {
          console.error("Missing access or refresh token");
          setError("Missing access or refresh token");
          setLoading(false);
          return;
        }

        console.log("Setting session with Supabase...");
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (sessionError) {
          console.error("Error setting session:", sessionError);
          setError(`Error setting session: ${sessionError.message}`);
          setLoading(false);
          return;
        }

        console.log("Session set successfully", data);

        // Fetch the current user to verify authentication
        const { data: sessionData, error: userError } =
          await supabase.auth.getSession();

        if (userError) {
          console.error("Error fetching user session:", userError);
          setError(`Error fetching user session: ${userError.message}`);
          setLoading(false);
          return;
        }

        console.log("Session data:", sessionData);

        if (sessionData.session && sessionData.session.user) {
          console.log("User authenticated:", sessionData.session.user);
          router.replace("/");
        } else {
          console.error("User not authenticated");
          setError("User not authenticated");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in handleAuthCallback:", error);
        setError(`Error in handleAuthCallback: ${error.message}`);
        setLoading(false);
      }
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router.isReady]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return <p>{error ? `Error: ${error}` : "Redirecting..."}</p>;
};

export default Callback;
