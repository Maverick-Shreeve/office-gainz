import { supabase } from "../../../utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // User successfully created
      return res.status(201).json({ data });
    } catch (error) {
      if (error.message.includes("exists")) {
        return res
          .status(409)
          .json({ message: "A user with this email already exists" });
      }
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
