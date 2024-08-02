import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../utils/supabaseClient";

const Callback = () => {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { access_token, refresh_token, expires_in, token_type } =
        router.query;

      if (!access_token || !refresh_token || !expires_in || !token_type) {
        console.error("Missing query parameters");
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        console.error("Error setting session:", error);
        return;
      }

      router.replace("/");
    };

    if (router.isReady) {
      handleAuthCallback();
    }
  }, [router]);

  return <p>Loading...</p>;
};

export default Callback;
