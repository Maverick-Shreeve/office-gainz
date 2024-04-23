import { supabase } from "../../utils/supabaseClient";
export default async function handler(req, res) {
  try {
    const session = await supabase.auth.session();

    if (session) {
      return res.json({ isLoggedIn: true });
    } else {
      return res.json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error("Error checking session:", error);
    return res.json({
      isLoggedIn: false,
      error: "Failed to check the session",
    });
  }
}
